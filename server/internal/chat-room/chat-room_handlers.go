package chat_room

import (
	appDefinitions "chat-server/definitions"
	"chat-server/util"
	"context"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/kataras/iris/v12"
	"net/http"
	"time"
)

type Handler struct {
	appDefinitions.ChatRoomService
}

var ChatRooms = map[string]appDefinitions.WsChatRoom{}
var Clients = map[string]appDefinitions.Client{}

func NewHandler(s appDefinitions.ChatRoomService) *Handler {
	return &Handler{
		ChatRoomService: s,
	}
}

func (h *Handler) GetChatRoom(ctx iris.Context) {
	chatRoomId := ctx.Params().Get("chatRoomId")
	userId := ctx.URLParam("userId")
	chatRoom, err := h.ChatRoomService.GetChatRoom(ctx, chatRoomId, userId)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := appDefinitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
	}
	ctx.StatusCode(http.StatusOK)
	res := appDefinitions.DefaultRes{
		IsSuccess: true,
		Message:   "成功",
		Data:      chatRoom,
	}
	_ = ctx.JSON(res)
}

func (h *Handler) GetChatRooms(ctx iris.Context) {
	userId := ctx.URLParam("userId")
	list, err := h.ChatRoomService.GetChatRooms(ctx, userId)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := appDefinitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := appDefinitions.DefaultRes{
		IsSuccess: true,
		Message:   "成功",
		Data:      list,
	}
	_ = ctx.JSON(res)
}

func (h *Handler) GetChatRoomMessage(ctx iris.Context) {
	chatRoomId := ctx.Params().Get("chatRoomId")
	list, err := h.ChatRoomService.GetChatRoomMessage(ctx, chatRoomId)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := appDefinitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := appDefinitions.DefaultRes{
		IsSuccess: true,
		Message:   "成功",
		Data:      list,
	}
	_ = ctx.JSON(res)
}

func (h *Handler) CreateChatRoom(ctx iris.Context) {
	var createChatRoomReq appDefinitions.CreateChatRoomReq
	err := ctx.ReadJSON(&createChatRoomReq)
	if err != nil {
		ctx.StatusCode(http.StatusBadRequest)
		res := appDefinitions.DefaultRes{
			Message: "Field error",
		}
		_ = ctx.JSON(res)
		return
	}
	chatRoomId, err := h.ChatRoomService.CreateChatRoom(ctx, &createChatRoomReq)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := appDefinitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
		return
	}
	AppendChatRoom(chatRoomId, createChatRoomReq.MembersID)
	ctx.StatusCode(http.StatusOK)
	res := appDefinitions.DefaultRes{
		IsSuccess: true,
		Message:   "成功",
	}
	_ = ctx.JSON(res)
}

func AppendChatRoom(chatRoomId string, members []string) {
	// 使用者登入後，後續新增的聊天室必需手動加入
	for _, member := range members {
		chatRoom, chatRoomIsExist := ChatRooms[chatRoomId]
		client, clientIsExist := Clients[member]
		if !chatRoomIsExist {
			if clientIsExist {
				ChatRooms[chatRoomId] = appDefinitions.WsChatRoom{
					ID: chatRoomId,
					Clients: map[string]appDefinitions.Client{
						client.ID: client,
					},
				}
			}
		} else {
			if clientIsExist {
				clients := chatRoom.Clients
				clients[client.ID] = client
			}
		}
	}
}

func (h *Handler) UseUserIdFriendIdGetChatRoom(ctx iris.Context) {
	userId := ctx.Params().Get("userId")
	friendId := ctx.Params().Get("friendId")
	chatRoom, err := h.ChatRoomService.UseUserIdFriendIdGetChatRoom(ctx, userId, friendId)
	if err != nil {
		ctx.StatusCode(http.StatusInternalServerError)
		res := appDefinitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
		return
	}
	ctx.StatusCode(http.StatusOK)
	res := appDefinitions.DefaultRes{
		IsSuccess: true,
		Message:   "成功",
		Data:      chatRoom,
	}
	_ = ctx.JSON(res)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *Handler) ConnectWs(ctx iris.Context) {
	conn, err := upgrader.Upgrade(ctx.ResponseWriter(), ctx.Request(), nil)
	if err != nil {
		ctx.StatusCode(http.StatusBadRequest)
		res := appDefinitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
		return
	}
	clientID := ctx.URLParam("userId")

	client := &appDefinitions.Client{
		Conn: conn,
		ID:   clientID,
	}
	Clients[clientID] = appDefinitions.Client{
		ID:   clientID,
		Conn: conn,
	}
	list := h.getUserChatRoomsId(ctx, clientID)
	for _, chatRoomId := range list {
		chatRoom, isExist := ChatRooms[chatRoomId]
		if !isExist {
			ChatRooms[chatRoomId] = appDefinitions.WsChatRoom{
				ID: chatRoomId,
				Clients: map[string]appDefinitions.Client{
					clientID: {
						ID:   clientID,
						Conn: conn,
					},
				},
			}
		} else {
			clients := chatRoom.Clients
			clients[clientID] = appDefinitions.Client{
				ID:   clientID,
				Conn: conn,
			}
		}
	}

	// Start a new goroutine to handle the WebSocket connection.
	go func(h *Handler, client *appDefinitions.Client) {
		handleWebSocketConnection(h, client)
	}(h, client)

}

//func SendRefreshWsToUser(clientId string, refreshTarget string) {
//	client, isExit := Clients[clientId]
//	if isExit {
//		client.Conn.WriteJSON()
//	}
//}

func (h *Handler) getUserChatRoomsId(ctx iris.Context, userId string) []string {
	token := ctx.Values().GetString("token")
	err := util.ParseToken(token)
	if err != nil {
		ctx.StatusCode(http.StatusUnauthorized)
		res := appDefinitions.DefaultRes{
			Message: err.Error(),
		}
		_ = ctx.JSON(res)
	}

	list, err := h.ChatRoomService.UseUserIdGetChatRoomsId(ctx, userId)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return list
}

func handleWebSocketConnection(h *Handler, client *appDefinitions.Client) {
	defer func() {
		// Remove the client from each chat room and check if any chat room becomes empty
		for _, chatRoom := range ChatRooms {
			room, exists := ChatRooms[chatRoom.ID]
			if exists {
				delete(room.Clients, client.ID)
				if len(room.Clients) == 0 {
					delete(ChatRooms, chatRoom.ID)
				}
			}
		}
		client.Conn.Close()
	}()

	// Create a channel for broadcasting messages to all clients in the same chat room
	broadcastChan := make(chan appDefinitions.Message)
	go broadcastMessage(broadcastChan)

	for {
		var msg appDefinitions.WsMessage
		if err := client.Conn.ReadJSON(&msg); err != nil {
			fmt.Println("Error reading message:", err)
			return
		}

		// Add sender ID and timestamp to the received message
		resMsg := appDefinitions.Message{
			SenderId:   msg.SenderId,
			ChatRoomId: msg.ChatRoomId,
			Content:    msg.Content,
			Timestamp:  time.Now().Unix(),
		}
		ctx := context.Background()
		id, err := h.ChatRoomService.WriteMessageToDB(ctx, &resMsg)
		if err != nil {
			fmt.Println(err.Error())
		}
		resMsg.MessageId = id

		// Broadcast the message to all clients in the same chat room
		broadcastChan <- resMsg

	}
}

func broadcastMessage(broadcastChan <-chan appDefinitions.Message) {
	for {
		resMsg := <-broadcastChan

		chatRoom, isExists := ChatRooms[resMsg.ChatRoomId]
		if isExists {
			for _, client := range chatRoom.Clients {
				if err := client.Conn.WriteJSON(resMsg); err != nil {
					fmt.Println("Error writing message:", err)
				}
			}
		}
	}
}
