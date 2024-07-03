package main

import (
	db "chat-server/db/postgres"
	"chat-server/internal/app"
	"chat-server/internal/auth"
	chatroom "chat-server/internal/chat-room"
	"chat-server/internal/user"
	"chat-server/router"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	"log"
)

func main() {
	irisApp := app.NewApp()
	dbConn, err := db.NewDatabase()
	if err != nil {
		log.Fatalf("連線至資料庫失敗")
	}
	driver, err := postgres.WithInstance(dbConn.GetDB(), &postgres.Config{})
	if err != nil {
		panic(err)
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file://db/migrations/",
		"postgres", driver)
	if err != nil {
		panic(err)
	}
	err = m.Up()
	if err != migrate.ErrNoChange {
		panic(fmt.Errorf("migrate step error: %v", err))
		return
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
