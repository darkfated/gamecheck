FROM golang:1.24-alpine AS builder
WORKDIR /app

RUN apk add --no-cache git ca-certificates bash

COPY go.mod go.sum ./
RUN go mod tidy

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o /app/bin/server ./cmd/server

FROM alpine:3.18

RUN apk add --no-cache ca-certificates postgresql-client

RUN addgroup -S app && adduser -S -G app app

WORKDIR /app

COPY --from=builder /app/bin/server /app/server
COPY ./entrypoint.sh /app/entrypoint.sh

RUN chown app:app /app/server /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- "http://localhost:${PORT:-5000}/health" || exit 1

USER app

EXPOSE 5000
ENV PORT=5000

ENTRYPOINT ["/app/entrypoint.sh"]
