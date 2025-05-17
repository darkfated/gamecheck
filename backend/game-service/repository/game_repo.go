package repository

import (
	"github.com/darkfated/gamecheck/backend/game-service/model"
	"gorm.io/gorm"
)

type GameRepo struct {
	DB *gorm.DB
}

func NewGameRepo(db *gorm.DB) *GameRepo {
	return &GameRepo{DB: db}
}

func (r *GameRepo) Create(g *model.Game) error {
	return r.DB.Create(g).Error
}

func (r *GameRepo) GetByID(id string) (*model.Game, error) {
	var g model.Game
	if err := r.DB.First(&g, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &g, nil
}

func (r *GameRepo) GetAll() ([]*model.Game, error) {
	var games []*model.Game
	if err := r.DB.Find(&games).Error; err != nil {
		return nil, err
	}
	return games, nil
}

func (r *GameRepo) Update(g *model.Game) error {
	return r.DB.Save(g).Error
}

func (r *GameRepo) Delete(id string) error {
	return r.DB.Delete(&model.Game{}, "id = ?", id).Error
}
