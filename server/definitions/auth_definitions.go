package definitions

import (
	"context"
)

type LoginUserReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginUserRes struct {
	Token    string `json:"token"`
	ID       string `json:"id"`
	Username string `json:"username"`
}

type AuthRepository interface {
	GetUserByEmail(ctx context.Context, email string) *User
}

type AuthService interface {
	Login(ctx context.Context, req *LoginUserReq) (*LoginUserRes, error)
}
