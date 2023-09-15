package router

import (
	"chat-server/definitions"
	"chat-server/util"
	"github.com/kataras/iris/v12"
	"net/http"
)

func RequireLogin(ctx iris.Context) {
	token := ctx.Values().GetString("token")
	claims, err := util.ParseToken(token)
	if err != nil {
		ctx.StatusCode(http.StatusUnauthorized)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
		return
	}
	ctx.Values().Set("userId", claims.ID)
	ctx.Next()
}
