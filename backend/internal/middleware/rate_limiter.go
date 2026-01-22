package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type RateLimiter struct {
	buckets map[string]*tokenBucket
	mu      sync.RWMutex

	tokensPerInterval int
	interval          time.Duration
	maxBurst          int

	cleanupTicker *time.Ticker
}

type tokenBucket struct {
	tokens     float64
	lastRefill time.Time
}

func NewRateLimiter(tokensPerInterval int, interval time.Duration, maxBurst int) *RateLimiter {
	rl := &RateLimiter{
		buckets:           make(map[string]*tokenBucket),
		tokensPerInterval: tokensPerInterval,
		interval:          interval,
		maxBurst:          maxBurst,
		cleanupTicker:     time.NewTicker(5 * time.Minute),
	}

	go func() {
		for range rl.cleanupTicker.C {
			rl.cleanup()
		}
	}()

	return rl
}

func (rl *RateLimiter) Allow(identifier string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	bucket, exists := rl.buckets[identifier]
	if !exists {
		rl.buckets[identifier] = &tokenBucket{
			tokens:     float64(rl.maxBurst - 1),
			lastRefill: time.Now(),
		}
		return true
	}

	now := time.Now()
	timePassed := now.Sub(bucket.lastRefill)
	tokensToAdd := float64(rl.tokensPerInterval) * timePassed.Seconds() / rl.interval.Seconds()

	bucket.tokens = min(bucket.tokens+tokensToAdd, float64(rl.maxBurst))
	bucket.lastRefill = now

	if bucket.tokens >= 1 {
		bucket.tokens--
		return true
	}

	return false
}

func (rl *RateLimiter) cleanup() {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	for id, bucket := range rl.buckets {
		if now.Sub(bucket.lastRefill) > 10*time.Minute {
			delete(rl.buckets, id)
		}
	}
}

func (rl *RateLimiter) Stop() {
	rl.cleanupTicker.Stop()
}

func min(a, b float64) float64 {
	if a < b {
		return a
	}
	return b
}

func getClientIP(ctx *gin.Context) string {
	if ip := ctx.Request.Header.Get("X-Forwarded-For"); ip != "" {
		if ips := net.ParseIP(ip); ips != nil {
			return ip
		}
	}

	if ip := ctx.Request.Header.Get("X-Real-IP"); ip != "" {
		if ips := net.ParseIP(ip); ips != nil {
			return ip
		}
	}

	ip, _, _ := net.SplitHostPort(ctx.Request.RemoteAddr)
	return ip
}

func RateLimitByUserOrIPFromContext(limiterKey string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		limiterInterface, exists := ctx.Get(limiterKey)
		if !exists {
			ctx.Next()
			return
		}

		limiter, ok := limiterInterface.(*RateLimiter)
		if !ok {
			ctx.Next()
			return
		}

		identifier := getClientIP(ctx)

		if userID, err := GetUserID(ctx); err == nil {
			identifier = "user:" + userID
		}

		if !limiter.Allow(identifier) {
			ctx.JSON(http.StatusTooManyRequests, gin.H{
				"error": "rate limit exceeded",
			})
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}
