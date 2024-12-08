package chat_room

import (
	"chat-server/definitions"
	"context"
	"fmt"
	"sort"
)

type service struct {
	definitions.ChatRoomRepository
}

func NewService(repository definitions.ChatRoomRepository) definitions.ChatRoomService {
	return &service{
		repository,
	}
}

func (s *service) GetChatRoom(ctx context.Context, chatRoomId string, userId string) (*definitions.GetChatRoomsRes, error) {
	chatRoomDetail := s.ChatRoomRepository.UseChatRoomsIdGetChatRoom(ctx, chatRoomId, userId)
	memberList := s.ChatRoomRepository.UseChatRoomsIdGetMembers(ctx, chatRoomId, userId)
	chatRoom := &definitions.GetChatRoomsRes{
		ID:         chatRoomDetail.ID,
		Name:       chatRoomDetail.Name,
		Type:       chatRoomDetail.Type,
		Photo:      chatRoomDetail.Photo,
		Members:    memberList,
		LastModify: chatRoomDetail.LastModify,
	}
	return chatRoom, nil
}

func (s *service) GetChatRooms(ctx context.Context, userId string) ([]*definitions.GetChatRoomsRes, error) {
	chatRoomIdList, err := s.ChatRoomRepository.UseUserIdGetChatRoomsId(ctx, userId)
	if err != nil {
		return nil, err
	}
	var chatRoomResList []*definitions.GetChatRoomsRes
	for _, chatRoomId := range chatRoomIdList {

		memberList := s.ChatRoomRepository.UseChatRoomsIdGetMembers(ctx, chatRoomId, userId)
		chatRoomDetail := s.ChatRoomRepository.UseChatRoomsIdGetChatRoom(ctx, chatRoomId, userId)
		chatRoom := &definitions.GetChatRoomsRes{
			ID:         chatRoomDetail.ID,
			Name:       chatRoomDetail.Name,
			Type:       chatRoomDetail.Type,
			Photo:      chatRoomDetail.Photo,
			Members:    memberList,
			LastModify: chatRoomDetail.LastModify,
		}
		chatRoomResList = append(chatRoomResList, chatRoom)
	}
	sort.Slice(chatRoomResList, func(i, j int) bool {
		return chatRoomResList[i].LastModify > chatRoomResList[j].LastModify
	})
	return chatRoomResList, nil
}

func (s *service) GetChatRoomMessage(ctx context.Context, chatRoomId string) ([]*definitions.Message, error) {
	return s.ChatRoomRepository.GetChatRoomMessage(ctx, chatRoomId)
}

func (s *service) CreateChatRoom(ctx context.Context, req *definitions.CreateChatRoomReq) (string, error) {
	return s.ChatRoomRepository.CreateChatRoom(ctx, req)

}

func (s *service) UseUserIdGetChatRoomsId(ctx context.Context, userId string) ([]string, error) {
	chatRoomsId, err := s.ChatRoomRepository.UseUserIdGetChatRoomsId(ctx, userId)
	fmt.Println("UseUserIdGetChatRoomsId", chatRoomsId)
	if err != nil {
		return nil, err
	}
	return chatRoomsId, nil
}

func (s *service) UseUserIdFriendIdGetChatRoom(ctx context.Context, userId string, friendId string) (string, error) {
	chatRoomId, err := s.ChatRoomRepository.UseUserIdFriendIdGetChatRoomId(ctx, userId, friendId)
	if err != nil {
		return "", err
	}
	return chatRoomId, nil
}

func (s *service) WriteMessageToDB(ctx context.Context, msg *definitions.Message) (int64, error) {
	return s.ChatRoomRepository.WriteMessageToDB(ctx, msg)
}
