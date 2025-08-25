package handlers

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"github.com/otaviozin/localvault/internal/services"
	"github.com/otaviozin/localvault/models"
	"golang.org/x/crypto/argon2"
)

var validate = validator.New()

type CreateUserRequest struct {
	Username string `json:"username" validate:"required,min=3,max=32"`
	Email    string `json:"email" validate:"required,email,max=255"`
	Password string `json:"password" validate:"required,min=6,max=255"`
}

func hashPassword(password string) (string, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}
	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	saltB64 := base64.RawStdEncoding.EncodeToString(salt)
	hashB64 := base64.RawStdEncoding.EncodeToString(hash)
	return fmt.Sprintf("%s$%s", saltB64, hashB64), nil
}

func CreateUser(userService services.UserService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req CreateUserRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
		}

		if err := validate.Struct(req); err != nil {
			errors := []string{}
			for _, e := range err.(validator.ValidationErrors) {
				errors = append(errors, e.Field()+" is invalid")
			}
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"validation_errors": errors})
		}

		hashedPassword, err := hashPassword(req.Password)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "failed to hash password"})
		}

		user := models.User{
			Username: req.Username,
			Email:    req.Email,
			Password: hashedPassword,
		}

		createdUser, err := userService.CreateUser(user)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"user": fiber.Map{
				"id":       createdUser.ID,
				"username": createdUser.Username,
				"email":    createdUser.Email,
			},
		})
	}
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func verifyPassword(storedHash, password string) bool {
	parts := strings.Split(storedHash, "$")
	if len(parts) != 2 {
		return false
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[0])
	if err != nil {
		return false
	}

	hash, err := base64.RawStdEncoding.DecodeString(parts[1])
	if err != nil {
		return false
	}

	computedHash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	return subtle.ConstantTimeCompare(hash, computedHash) == 1
}

func Login(userService services.UserService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var req LoginRequest
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
		}

		if err := validate.Struct(req); err != nil {
			errors := []string{}
			for _, e := range err.(validator.ValidationErrors) {
				errors = append(errors, e.Field()+" is invalid")
			}
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"validation_errors": errors})
		}

		user, err := userService.FindByEmail(req.Email)
		if err != nil || user.ID == 0 {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid email or password"})
		}

		if !verifyPassword(user.Password, req.Password) {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid email or password"})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "login successful",
			"user": fiber.Map{
				"id":       user.ID,
				"username": user.Username,
				"email":    user.Email,
			},
		})
	}
}
