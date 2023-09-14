package util

import (
	"chat-server/definitions"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}

	return string(hashedPassword), nil
}

func CheckPassword(password string, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func ParseToken(tokenString string) error {

	token, err := jwt.ParseWithClaims(tokenString, &definitions.MyJWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(definitions.SecretKey), nil
	})

	if err != nil {
		fmt.Println("解析token錯誤:", err)
		return err
	}

	// 检查 token 是否有效
	if claims, ok := token.Claims.(*definitions.MyJWTClaims); ok && token.Valid {
		fmt.Println("ID:", claims.ID)
		fmt.Println("Username:", claims.Username)
		return nil
	} else {
		fmt.Println("無效的token")
		return fmt.Errorf("無效的token")
	}
}
