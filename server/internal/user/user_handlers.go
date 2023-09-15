package user

import (
	"bytes"
	"chat-server/definitions"
	"fmt"
	"github.com/kataras/iris/v12"
	"image"
	"image/png"
	"net/http"
)

type Handler struct {
	definitions.UserService
}

func NewHandler(s definitions.UserService) *Handler {
	return &Handler{
		UserService: s,
	}
}

func (h *Handler) GetUser(ctx iris.Context) {
	userId := ctx.Values().GetString("userId")
	user, err := h.UserService.GetUser(ctx, userId)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := definitions.DefaultRes{
		IsSuccess: true,
		Message:   "成功",
		Data:      user,
	}
	_ = ctx.JSON(res)
}

func (h *Handler) CreateUser(ctx iris.Context) {
	var userReq definitions.CreateUserReq

	if err := ctx.ReadJSON(&userReq); err != nil {
		ctx.StatusCode(http.StatusBadRequest)
		res := definitions.DefaultRes{
			Message: "Field error",
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}

	isEmailUsed := h.UserService.CheckEmailIsUsed(ctx, userReq.Email)
	if isEmailUsed {
		ctx.StatusCode(http.StatusOK)
		res := definitions.DefaultRes{
			Message: "Email already exit",
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}

	userRes, err := h.UserService.CreateUser(ctx, &userReq)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		err = ctx.JSON(res)
		if err != nil {
			fmt.Println(err)
		}
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := definitions.DefaultRes{
		IsSuccess: true,
		Message:   "Success",
		Data:      userRes,
	}
	err = ctx.JSON(res)
	if err != nil {
		fmt.Println(err.Error())
	}
}

func (h *Handler) UpdateUser(ctx iris.Context) {
	var userReq definitions.UpdateUserReq

	if err := ctx.ReadJSON(&userReq); err != nil {
		ctx.StatusCode(http.StatusBadRequest)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}

	isEmailUsed := h.UserService.CheckEmailIsUsed(ctx, userReq.Email)
	if isEmailUsed {
		ctx.StatusCode(http.StatusOK)
		res := definitions.DefaultRes{
			Message: "Email already exit",
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}

	userRes, err := h.UserService.UpdateUser(ctx, &userReq)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := definitions.DefaultRes{
		IsSuccess: true,
		Message:   "Update Succeed",
		Data:      userRes,
	}
	err = ctx.JSON(res)
	if err != nil {
		fmt.Println(err.Error())
	}
}

func (h *Handler) SaveUserPhoto(ctx iris.Context) {
	photo, info, err := ctx.FormFile("photo")
	if err != nil {
		ctx.StatusCode(http.StatusBadRequest)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}
	defer photo.Close()

	userId := ctx.Values().GetString("userId")
	err = h.UserService.SaveUserPhoto(ctx, userId, photo, *info)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := definitions.DefaultRes{
		IsSuccess: true,
		Message:   "Photo saved",
	}
	err = ctx.JSON(res)
	if err != nil {
		fmt.Println(err.Error())
	}
}

func (h *Handler) GetUserPhoto(ctx iris.Context) {
	userId := ctx.Values().GetString("userId")
	photo, err := h.UserService.GetUserPhoto(ctx, userId)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}
	if photo == nil {
		ctx.StatusCode(http.StatusNotFound)
		_, _ = ctx.WriteString("Image not found")
		return
	}

	img, _, err := image.Decode(bytes.NewReader(photo))
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		_, _ = ctx.WriteString("Failed to decode image")
		return
	}

	buf := new(bytes.Buffer)
	err = png.Encode(buf, img)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		_, _ = ctx.WriteString("Failed to encode image")
		return
	}

	ctx.ContentType("image/png")
	_, _ = ctx.Write(buf.Bytes())
}

func (h *Handler) GetFriends(ctx iris.Context) {
	userId := ctx.Values().GetString("userId")
	invitationStatus := ctx.URLParam("invitationStatus")
	list, err := h.UserService.GetFriends(ctx, userId, invitationStatus)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := definitions.DefaultRes{
		IsSuccess: true,
		Message:   "成功",
		Data:      list,
	}
	_ = ctx.JSON(res)
}

func (h *Handler) GetGroup(ctx iris.Context) {
	userId := ctx.Values().GetString("userId")
	list, err := h.UserService.GetGroup(ctx, userId)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := definitions.DefaultRes{
		IsSuccess: true,
		Message:   "成功",
		Data:      list,
	}
	_ = ctx.JSON(res)
}

func (h *Handler) AddFriend(ctx iris.Context) {
	userId := ctx.Values().GetString("userId")
	var addFriendReq definitions.AddFriendReq

	if err := ctx.ReadJSON(&addFriendReq); err != nil {
		ctx.StatusCode(http.StatusBadRequest)
		res := definitions.DefaultRes{
			Message: "field error",
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}

	friend, err := h.UserService.UseEmailGetUser(ctx, addFriendReq.Email)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := definitions.DefaultRes{Message: err.Error()}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}
	if friend.ID == "" {
		ctx.StatusCode(http.StatusOK)
		res := definitions.DefaultRes{
			Message: "查無此使用者",
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}

	result, err := h.UserService.AddFriend(ctx, userId, &addFriendReq, friend)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		err := ctx.JSON(res)
		if err != nil {
			fmt.Println(err.Error())
		}
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := definitions.DefaultRes{
		IsSuccess: true,
		Data:      result,
	}
	err = ctx.JSON(res)
	if err != nil {
		fmt.Println(err.Error())
	}
}

func (h *Handler) ModifyFriendStatus(ctx iris.Context) {
	userId := ctx.Values().GetString("userId")
	friendId := ctx.Params().Get("friendId")
	invitationStatus := ctx.URLParam("invitationStatus")
	err := h.UserService.ModifyFriendStatus(ctx, userId, friendId, invitationStatus)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := definitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := definitions.DefaultRes{
		IsSuccess: true,
		Message:   "成功",
	}
	_ = ctx.JSON(res)
}

func (h *Handler) DeleteFriend(ctx iris.Context) {

}
