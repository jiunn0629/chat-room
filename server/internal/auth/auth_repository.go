package auth

import (
	"chat-server/definitions"
	"context"
	"fmt"
)

type repository struct {
	db definitions.DBTX
}

func NewRepository(db definitions.DBTX) definitions.AuthRepository {
	return &repository{db: db}
}

func (r *repository) GetUserByEmail(ctx context.Context, email string) *definitions.User {
	u := definitions.User{}
	query := "SELECT id, email, username, password FROM users WHERE email = $1"
	row := r.db.QueryRowContext(ctx, query, email)
	err := row.Scan(&u.ID, &u.Email, &u.Username, &u.Password)
	if err != nil {
		fmt.Println(err.Error())
	}
	return &u
}
