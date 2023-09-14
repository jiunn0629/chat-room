package auth

import (
	"chat-server/definitions"
	"chat-server/util"
	"context"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

type service struct {
	definitions.AuthRepository
}

func NewService(repository definitions.AuthRepository) definitions.AuthService {
	return &service{
		repository,
	}
}

func (s *service) Login(ctx context.Context, req *definitions.LoginUserReq) (*definitions.LoginUserRes, error) {
	u := s.AuthRepository.GetUserByEmail(ctx, req.Email)
	if len(u.ID) == 0 {
		return &definitions.LoginUserRes{}, fmt.Errorf("此信箱未註冊")
	}
	err := util.CheckPassword(req.Password, u.Password)
	if err != nil {
		return &definitions.LoginUserRes{}, fmt.Errorf("密碼錯誤")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, definitions.MyJWTClaims{
		ID:       u.ID,
		Username: u.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    u.ID,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	})

	ss, err := token.SignedString([]byte(definitions.SecretKey))
	if err != nil {
		return &definitions.LoginUserRes{}, err
	}

	return &definitions.LoginUserRes{Token: ss, Username: u.Username, ID: u.ID}, nil
}
