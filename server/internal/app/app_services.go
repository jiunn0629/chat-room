package app

import (
	"github.com/kataras/iris/v12"
)

type App struct {
	app *iris.Application
}

func NewApp() *iris.Application {
	app := iris.Default()
	app.Use(tokenMiddleware)

	return app
}

func tokenMiddleware(ctx iris.Context) {
	token := ctx.GetHeader("Authorization")
	if len(token) > 7 && token[:7] == "Bearer " {
		token = token[7:]
	}
	ctx.Values().Set("token", token)
	ctx.Next()
}
