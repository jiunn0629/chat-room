package router

import (
	"chat-server/internal/auth"
	chat_room "chat-server/internal/chat-room"
	"chat-server/internal/user"
	"github.com/kataras/iris/v12"
)

func InitRouter(app *iris.Application,
	authHandler *auth.Handler,
	userHandler *user.Handler,
	chatRoomHandler *chat_room.Handler,
) {

	authRoute := app.Party("/auth")
	{
		authRoute.Post("/login", authHandler.Login)
	}

	userRoute := app.Party("/user")
	{
		userRoute.Post("", userHandler.CreateUser)
		userRoute.Put("", userHandler.UpdateUser)
		userRoute.Get("/{userId}", userHandler.GetUser)
		userRoute.Get("/{userId}/photo", userHandler.GetUserPhoto)
		userRoute.Post("/{userId}/photo", userHandler.SaveUserPhoto)
		userRoute.Post("/{userId}/friend", userHandler.AddFriend)
		userRoute.Get("/{userId}/friends", userHandler.GetFriends)
		userRoute.Get("/{userId}/groups", userHandler.GetGroup)
		userRoute.Put("/{userId}/friends/{friendId}", userHandler.ModifyFriendStatus)
	}

	chatRoomRoute := app.Party("/chat-room")
	{
		chatRoomRoute.Get("", chatRoomHandler.GetChatRooms)
		chatRoomRoute.Get("/{chatRoomId}", chatRoomHandler.GetChatRoom)
		chatRoomRoute.Get("/{chatRoomId}/message", chatRoomHandler.GetChatRoomMessage)
		chatRoomRoute.Post("", chatRoomHandler.CreateChatRoom)
		chatRoomRoute.Get("/user/{userId}/friend/{friendId}", chatRoomHandler.UseUserIdFriendIdGetChatRoom)
		chatRoomRoute.Get("/ws", chatRoomHandler.ConnectWs)
	}

}
