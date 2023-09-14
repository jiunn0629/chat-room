package main

import (
	"chat-server/db/sqlite"
	"chat-server/internal/app"
	"chat-server/internal/auth"
	chat_room "chat-server/internal/chat-room"
	"chat-server/internal/user"
	"chat-server/router"
	"log"
)

func main() {
	app := app.NewApp()
	//dbConn, err := postgres.NewDatabase()
	dbConn, err := sqlite.NewDatabase()
	if err != nil {
		log.Fatalf("連線至資料庫失敗")
	}
	authRepo := auth.NewRepository(dbConn.GetDB())
	authSvc := auth.NewService(authRepo)
	authHandler := auth.NewHandler(authSvc)
	userRepo := user.NewRepository(dbConn.GetDB())
	userSvc := user.NewService(userRepo)
	userHandler := user.NewHandler(userSvc)
	chatRoomRepo := chat_room.NewRepository(dbConn.GetDB())
	chatRoomSvc := chat_room.NewService(chatRoomRepo)
	chatRoomHandler := chat_room.NewHandler(chatRoomSvc)

	//hub := ws.NewHub()
	//wsHandler := ws.NewHandler(hub)
	//go hub.Run()

	router.InitRouter(app, authHandler, userHandler, chatRoomHandler)
	app.Listen(":8080")
}
