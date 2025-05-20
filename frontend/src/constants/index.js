export const API_URL = "http://localhost:5000/api"

export const GAME_STATUSES = {
  PLAN_TO_PLAY: "plan_to_play",
  PLAYING: "playing",
  COMPLETED: "completed",
  DROPPED: "dropped",
}

export const GAME_STATUS_LABELS = {
  [GAME_STATUSES.PLAN_TO_PLAY]: "Планирую",
  [GAME_STATUSES.PLAYING]: "Играю",
  [GAME_STATUSES.COMPLETED]: "Пройдено",
  [GAME_STATUSES.DROPPED]: "Брошено",
}

export const GAME_STATUS_CONFIG = {
  [GAME_STATUSES.PLAYING]: {
    value: GAME_STATUSES.PLAYING,
    label: GAME_STATUS_LABELS[GAME_STATUSES.PLAYING],
    color: "emerald",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-400",
    gradient: "from-green-500 to-emerald-500",
  },
  [GAME_STATUSES.COMPLETED]: {
    value: GAME_STATUSES.COMPLETED,
    label: GAME_STATUS_LABELS[GAME_STATUSES.COMPLETED],
    color: "blue",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-400",
    gradient: "from-blue-500 to-indigo-500",
  },
  [GAME_STATUSES.PLAN_TO_PLAY]: {
    value: GAME_STATUSES.PLAN_TO_PLAY,
    label: GAME_STATUS_LABELS[GAME_STATUSES.PLAN_TO_PLAY],
    color: "purple",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-400",
    gradient: "from-yellow-500 to-amber-500",
  },
  [GAME_STATUSES.DROPPED]: {
    value: GAME_STATUSES.DROPPED,
    label: GAME_STATUS_LABELS[GAME_STATUSES.DROPPED],
    color: "red",
    bgClass: "bg-red-500/10",
    textClass: "text-red-400",
    gradient: "from-red-500 to-pink-500",
  },
}

export const getStatusOptions = () => Object.values(GAME_STATUS_CONFIG)

export const ACTIVITY_TYPES = {
  ADD_GAME: "add_game",
  UPDATE_STATUS: "update_status",
  UPDATE_GAME: "update_game",
  RATE_GAME: "rate_game",
  FOLLOW_USER: "follow",
  UNFOLLOW_USER: "unfollow"
}

export const ROUTES = {
  HOME: "/",
  PROFILE: "/profile/:id",
  FEED: "/feed",
  LOGIN: "/login",
}
