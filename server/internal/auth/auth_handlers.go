package auth

import (
	appDefinitions "chat-server/definitions"
	"fmt"
	"github.com/kataras/iris/v12"
	"net/http"
)

type Handler struct {
	appDefinitions.AuthService
}

func NewHandler(s appDefinitions.AuthService) *Handler {
	return &Handler{
		AuthService: s,
	}
}

func (h *Handler) Login(ctx iris.Context) {
	var loginReq appDefinitions.LoginUserReq
	var err error
	if err = ctx.ReadJSON(&loginReq); err != nil {
		ctx.StatusCode(http.StatusBadRequest)
		res := appDefinitions.DefaultRes{
			Message: "Field error",
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}

	user, err := h.AuthService.Login(ctx, &loginReq)
	if err != nil {
		ctx.StatusCode(http.StatusOK)
		res := appDefinitions.DefaultRes{
			Message: err.Error(),
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := appDefinitions.DefaultRes{
		IsSuccess: true,
		Message:   "Success",
		Data:      user,
	}
	err = ctx.JSON(res)
	if err != nil {
		fmt.Println(err.Error())
	}
}
