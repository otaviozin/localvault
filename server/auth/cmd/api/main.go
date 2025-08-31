package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/otaviozin/localvault/internal/config"
	"github.com/otaviozin/localvault/internal/db"
	"github.com/otaviozin/localvault/internal/repositories"
	"github.com/otaviozin/localvault/internal/services"
	"github.com/otaviozin/localvault/models"
)

func main() {
	config.LoadConfig()

	db.Connect()

	err := db.DB.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("error in automigrate", err)
	}

	app := fiber.New()
	app.Get("/healthy", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(&fiber.Map{
			"message": "Auth service is working",
		})
	})

	// User dependencies
	userRepo := repositories.NewUserRepository(db.DB)
	userService := services.NewUserService(userRepo)

	// Auth Routes
	AuthRoutes(app, userService)

	log.Fatal(app.Listen(":8001"))
}
