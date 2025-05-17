import { useState, useCallback } from "react"
import api from "../services/api"

export const useSubscriptions = () => {
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getFollowers = useCallback(async userId => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.subscriptions.getFollowers(userId)
      setFollowers(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      console.error("Error fetching followers:", err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getFollowing = useCallback(async userId => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.subscriptions.getFollowing(userId)
      setFollowing(response.data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      console.error("Error fetching following:", err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const followUser = useCallback(async userId => {
    try {
      setLoading(true)
      setError(null)
      await api.subscriptions.follow(userId)
      return true
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      console.error("Error following user:", err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const unfollowUser = useCallback(async userId => {
    try {
      setLoading(true)
      setError(null)
      await api.subscriptions.unfollow(userId)
      return true
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      console.error("Error unfollowing user:", err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    followers,
    following,
    loading,
    error,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
  }
}
