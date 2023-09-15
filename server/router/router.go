package router

import (
	"chat-server/internal/auth"
	chatroom "chat-server/internal/chat-room"
	"chat-server/internal/user"
	"github.com/kataras/iris/v12"
)

func InitRouter(app *iris.Application,
	authHandler *auth.Handler,
	userHandler *user.Handler,
	chatRoomHandler *chatroom.Handler,
) {

	authRoute := app.Party("/auth")
	{
		authRoute.Post("/login", authHandler.Login)
	}

	userRoute := app.Party("/user")
	{
		userRoute.Post("", userHandler.CreateUser)
		userRoute.Put("", RequireLogin, userHandler.UpdateUser)
		userRoute.Get("", RequireLogin, userHandler.GetUser)
		userRoute.Get("/photo", RequireLogin, userHandler.GetUserPhoto)
		userRoute.Post("/photo", RequireLogin, userHandler.SaveUserPhoto)
		userRoute.Post("/friend", RequireLogin, userHandler.AddFriend)
		userRoute.Get("/friends", RequireLogin, userHandler.GetFriends)
		userRoute.Get("/groups", RequireLogin, userHandler.GetGroup)
		userRoute.Put("/friends/{friendId}", RequireLogin, userHandler.ModifyFriendStatus)
	}

	chatRoomRoute := app.Party("/chat-room")
	{
		chatRoomRoute.Get("", RequireLogin, chatRoomHandler.GetChatRooms)
		chatRoomRoute.Get("/{chatRoomId}", RequireLogin, chatRoomHandler.GetChatRoom)
		chatRoomRoute.Get("/{chatRoomId}/message", RequireLogin, chatRoomHandler.GetChatRoomMessage)
		chatRoomRoute.Post("", RequireLogin, chatRoomHandler.CreateChatRoom)
		chatRoomRoute.Get("/user/friend/{friendId}", RequireLogin, chatRoomHandler.UseUserIdFriendIdGetChatRoom)
		chatRoomRoute.Get("/ws", chatRoomHandler.ConnectWs)
	}

}
