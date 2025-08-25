package services

import (
	"errors"

	"github.com/otaviozin/localvault/internal/repositories"
	"github.com/otaviozin/localvault/models"
)

type UserService interface {
	CreateUser(user models.User) (models.User, error)
	FindByEmail(email string) (models.User, error)
}

type userService struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &userService{repo}
}

func (s *userService) CreateUser(user models.User) (models.User, error) {
	existingUser, _ := s.repo.FindByEmail(user.Email)
	if existingUser.ID != 0 {
		return models.User{}, errors.New("email already in use")
	}

	return s.repo.Create(user)
}

func (s *userService) FindByEmail(email string) (models.User, error) {
	return s.repo.FindByEmail(email)
}
