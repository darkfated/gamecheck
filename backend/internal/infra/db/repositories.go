package db

import "gamecheck/internal/infra/db/repositories"

type Repositories struct {
	*repositories.Repository
}

func NewRepositories(db *Database) *Repositories {
	return &Repositories{
		Repository: repositories.NewRepositories(db.GetDB()),
	}
}
