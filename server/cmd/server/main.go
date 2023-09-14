package main

import (
	"chat-server/db/sqlite"
	"chat-server/internal/app"
	"chat-server/internal/auth"
	chatroom "chat-server/internal/chat-room"
	"chat-server/internal/user"
	"chat-server/router"
	"log"
)

func main() {
	irisApp := app.NewApp()
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
	chatRoomRepo := chatroom.NewRepository(dbConn.GetDB())
	chatRoomSvc := chatroom.NewService(chatRoomRepo)
	chatRoomHandler := chatroom.NewHandler(chatRoomSvc)

	//hub := ws.NewHub()
	//wsHandler := ws.NewHandler(hub)
	//go hub.Run()

	router.InitRouter(irisApp, authHandler, userHandler, chatRoomHandler)
	err = irisApp.Listen(":8080")
	if err != nil {
		return
	}
}
