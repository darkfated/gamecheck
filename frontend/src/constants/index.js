export const API_URL = "http://localhost:5000/api"

export const GAME_STATUSES = {
  PLANNED: "planned",
  PLAYING: "playing",
  COMPLETED: "completed",
  DROPPED: "dropped",
}

export const GAME_STATUS_LABELS = {
  [GAME_STATUSES.PLANNED]: "Планирую",
  [GAME_STATUSES.PLAYING]: "Играю",
  [GAME_STATUSES.COMPLETED]: "Пройдено",
  [GAME_STATUSES.DROPPED]: "Брошено",
}

export const ACTIVITY_TYPES = {
  ADD_GAME: "add_game",
  UPDATE_STATUS: "update_status",
  RATE_GAME: "rate_game",
  FOLLOW_USER: "follow_user",
  UNFOLLOW_USER: "unfollow_user",
}

export const ROUTES = {
  HOME: "/",
  PROFILE: "/profile/:id",
  FEED: "/feed",
  LOGIN: "/login",
}
