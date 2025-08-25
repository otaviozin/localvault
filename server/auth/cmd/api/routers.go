package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/otaviozin/localvault/cmd/api/handlers"
	"github.com/otaviozin/localvault/internal/services"
)

func AuthRoutes(app *fiber.App, userService services.UserService) {
	app.Post("/login", handlers.Login(userService))
	app.Post("/create-user", handlers.CreateUser(userService))
}
