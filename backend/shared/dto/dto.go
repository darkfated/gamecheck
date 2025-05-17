package dto

// Универсальный ответ с ошибкой
type ErrorResponse struct {
    Error string `json:"error"`
}

// Запрос по ID
type IDRequest struct {
    ID string `json:"id" binding:"required,uuid"`
}
