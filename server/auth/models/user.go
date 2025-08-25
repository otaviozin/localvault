package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique;not null;size:32;"`
	Email    string `json:"email" gorm:"unique;not null;size:255"`
	Password string `json:"password" gorm:"not null;size:255"`
}
