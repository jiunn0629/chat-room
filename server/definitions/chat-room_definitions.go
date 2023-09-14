package definitions

import (
	"context"
	"github.com/gorilla/websocket"
)

type Client struct {
	Conn *websocket.Conn
	ID   string `json:"id"`
}

type WsChatRoom struct {
	ID      string            `json:"id"`
	Clients map[string]Client `json:"clients"`
}

type WsMessage struct {
	SenderId   string `json:"senderId"`
	ChatRoomId string `json:"chatRoomId"`
	Content    string `json:"content"`
}

type Message struct {
	MessageId  int64  `json:"messageId"`
	SenderId   string `json:"senderId"`
	ChatRoomId string `json:"chatRoomId"`
	Content    string `json:"content"`
	Timestamp  int64  `json:"timestamp"`
}

type CreateChatRoomReq struct {
	MembersID []string `json:"membersID"`
	Name      string   `json:"name"`
	Type      string   `json:"type"`
	Photo     string   `json:"photo"`
}

type GetChatRoomsRes struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	Type       string    `json:"type"`
	Photo      string    `json:"photo"`
	Members    []*Member `json:"members"`
	LastModify int64     `json:"lastModify"`
}

type ChatRoom struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Type       string `json:"type"`
	Photo      string `json:"photo"`
	LastModify int64  `json:"lastModify"`
}

type Member struct {
	ID    string `json:"id" db:"id"`
	Name  string `json:"name" db:"name"`
	Photo []byte `json:"photo" db:"photo"`
}

type ChatRoomService interface {
	GetChatRoom(ctx context.Context, chatRoomId string, userId string) (*GetChatRoomsRes, error)
	GetChatRooms(ctx context.Context, userId string) ([]*GetChatRoomsRes, error)
	GetChatRoomMessage(ctx context.Context, chatRoomId string) ([]*Message, error)
	CreateChatRoom(ctx context.Context, req *CreateChatRoomReq) (string, error)
	UseUserIdGetChatRoomsId(ctx context.Context, userId string) ([]string, error)
	UseUserIdFriendIdGetChatRoom(ctx context.Context, userId string, friendId string) (string, error)
	WriteMessageToDB(ctx context.Context, msg *Message) (int64, error)
}

type ChatRoomRepository interface {
	CreateChatRoom(ctx context.Context, req *CreateChatRoomReq) (string, error)
	UseUserIdGetChatRoomsId(ctx context.Context, userId string) ([]string, error)
	UseChatRoomsIdGetMembers(ctx context.Context, chatRoomId string, userId string) []*Member
	UseChatRoomsIdGetChatRoom(ctx context.Context, chatRoomId string, userId string) *ChatRoom
	GetChatRoomMessage(ctx context.Context, chatRoomId string) ([]*Message, error)
	UseUserIdFriendIdGetChatRoomId(ctx context.Context, userId string, friendId string) (string, error)
	WriteMessageToDB(ctx context.Context, msg *Message) (int64, error)
}
