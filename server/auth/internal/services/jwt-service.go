package services

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/otaviozin/localvault/internal/config"
)

type Claims struct {
	UserID      uint     `json:"user_id"`
	Email       string   `json:"email"`
	Username    string   `json:"username"`
	Permissions []string `json:"permissions"`
	jwt.RegisteredClaims
}

func GenerateJWT(userID uint, email, username string, permissions []string) (string, error) {
	claims := &Claims{
		UserID:      userID,
		Email:       email,
		Username:    username,
		Permissions: permissions,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(config.JWTSecret)
}

func ValidateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}

		return config.JWTSecret, nil
	})

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, err
}
