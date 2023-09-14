package definitions

import (
	"context"
	"image"
	"mime/multipart"
)

type User struct {
	ID       string `json:"id"  db:"id"`
	Username string `json:"username" db:"username"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
	Photo    []byte `json:"photo" db:"photo"`
	Status   string `json:"status" db:"status"`
}

type UserRes struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Photo    []byte `json:"photo"`
	Status   string `json:"status"`
}

type CreateUserReq struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateUserRes struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type UpdateUserReq struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Status   string `json:"status"`
}

type UpdateUserRes struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Status   string `json:"status"`
}

type GetUserPhoto struct {
	Photo image.Image `json:"photo"`
}

type Friend struct {
	ID                string `json:"id" db:"id"`
	FriendID          string `json:"friendId" db:"friend_id"`
	Nickname          string `json:"nickname" db:"nickname"`
	InvitationStatus  string `json:"invitationStatus" db:"invitation_status"`
	InvitationMessage string `json:"invitationMessage" db:"invitation_message"`
}

type GetFriendsRes struct {
	ID                string `json:"id"  db:"id"`
	Username          string `json:"username" db:"username"`
	Email             string `json:"email" db:"email"`
	Photo             []byte `json:"photo" db:"photo"`
	Status            string `json:"status" db:"status"`
	InvitationMessage string `json:"invitationMessage" db:"invitation_message"`
}

type AddFriendReq struct {
	Email             string `json:"email"`
	InvitationMessage string `json:"invitationMessage"`
}

type UserService interface {
	CheckEmailIsUsed(ctx context.Context, email string) bool
	CreateUser(ctx context.Context, req *CreateUserReq) (*CreateUserRes, error)
	UpdateUser(ctx context.Context, req *UpdateUserReq) (*UpdateUserRes, error)
	GetUser(ctx context.Context, userId string) (*UserRes, error)
	SaveUserPhoto(ctx context.Context, userId string, photo multipart.File, info multipart.FileHeader) error
	GetUserPhoto(ctx context.Context, userId string) ([]byte, error)
	UseEmailGetUser(ctx context.Context, email string) (*User, error)
	AddFriend(ctx context.Context, userId string, req *AddFriendReq, friend *User) (*Friend, error)
	GetFriends(ctx context.Context, userId string, invitationStatus string) ([]*GetFriendsRes, error)
	ModifyFriendStatus(ctx context.Context, userId string, friendId string, invitationStatus string) error
	GetGroup(ctx context.Context, userId string) ([]*GetChatRoomsRes, error)
}

type UserRepository interface {
	CheckEmailIsUsed(ctx context.Context, email string) bool
	CreateUser(ctx context.Context, user *User) (*User, error)
	UpdateUser(ctx context.Context, user *UpdateUserReq) (*User, error)
	GetUser(ctx context.Context, userId string) (*UserRes, error)
	SaveUserPhoto(ctx context.Context, userId string, photo []byte) error
	GetUserPhoto(ctx context.Context, userId string) ([]byte, error)
	UseEmailGetUser(ctx context.Context, email string) (*User, error)
	AddFriend(ctx context.Context, userId string, req *AddFriendReq, friend *User) (*Friend, error)
	GetListFromFriends(ctx context.Context, userId string, invitationStatus string) ([]string, error)
	GetListFromUsers(ctx context.Context, userId string, friendId []string, invitationStatus string) ([]*GetFriendsRes, error)
	ModifyFriendStatus(ctx context.Context, userId string, friendId string, invitationStatus string) error
	GetGroup(ctx context.Context, userId string) ([]*GetChatRoomsRes, error)
}
