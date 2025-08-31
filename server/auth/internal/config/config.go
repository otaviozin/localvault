package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

var JWTSecret []byte
var JWTExpiresIn time.Duration

func LoadConfig() {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found")
	}

	JWTSecret = []byte(os.Getenv("JWT_SECRET_KEY"))

	dur, err := time.ParseDuration(os.Getenv("JWT_EXPIRES_IN"))
	if err != nil {
		dur = 24 * time.Hour
	}

	JWTExpiresIn = dur
}
