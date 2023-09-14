package user

import (
	"bytes"
	"chat-server/definitions"
	"chat-server/util"
	"context"
	"github.com/nfnt/resize"
	"image"
	"image/jpeg"
	"image/png"
	"io/ioutil"
	"mime/multipart"
	"strings"
)

type service struct {
	definitions.UserRepository
}

func NewService(repository definitions.UserRepository) definitions.UserService {
	return &service{
		repository,
	}
}

func getFileExtension(filename string) string {
	segment := strings.Split(filename, ".")
	if len(segment) > 1 {
		return segment[len(segment)-1]
	}
	return ""
}

func compressImage(data []byte, fileExtension string) ([]byte, error) {
	var image image.Image
	var err error
	if fileExtension == "png" {
		// 以PNG格式解碼圖片
		image, err = png.Decode(bytes.NewReader(data))
		if err != nil {
			return nil, err
		}
	} else if fileExtension == "jpg" || fileExtension == "jpeg" {
		// 以JPEG格式解碼圖片
		image, err = jpeg.Decode(bytes.NewReader(data))
		if err != nil {
			return nil, err
		}
	}

	const targetSize = 50 * 1024 // 50KB
	resizedImage := resize.Resize(0, 0, image, resize.Lanczos3)

	// 根據目標調整圖片
	quality := 90
	var compressedData *bytes.Buffer

	for {
		buffer := new(bytes.Buffer)

		err = jpeg.Encode(buffer, resizedImage, &jpeg.Options{Quality: quality})
		if err != nil {
			return nil, err
		}

		if buffer.Len() < targetSize || quality <= 10 {
			compressedData = buffer
			break
		}

		quality -= 10
	}

	return compressedData.Bytes(), nil
}

func (s *service) CheckEmailIsUsed(ctx context.Context, email string) bool {
	r := s.UserRepository.CheckEmailIsUsed(ctx, email)
	return r
}

func (s *service) GetUser(ctx context.Context, userId string) (*definitions.UserRes, error) {
	user, err := s.UserRepository.GetUser(ctx, userId)
	if err != nil {
		return user, err
	}
	return user, nil
}

func (s *service) CreateUser(ctx context.Context, req *definitions.CreateUserReq) (*definitions.CreateUserRes, error) {
	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	u := &definitions.User{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
	}

	r, err := s.UserRepository.CreateUser(ctx, u)
	if err != nil {
		return nil, err
	}

	res := &definitions.CreateUserRes{
		ID:       r.ID,
		Username: r.Username,
		Email:    r.Email,
	}

	return res, nil
}

func (s *service) UpdateUser(ctx context.Context, req *definitions.UpdateUserReq) (*definitions.UpdateUserRes, error) {
	var err error
	if req.Password != "" {
		req.Password, err = util.HashPassword(req.Password)
		if err != nil {
			return nil, err
		}
	}

	r, err := s.UserRepository.UpdateUser(ctx, req)
	if err != nil {
		return nil, err
	}
	res := &definitions.UpdateUserRes{
		ID:       r.ID,
		Username: r.Username,
		Email:    r.Email,
		Status:   r.Status,
	}
	return res, nil
}

func (s *service) SaveUserPhoto(ctx context.Context, userId string, photo multipart.File, info multipart.FileHeader) error {
	// 讀取圖片數據
	fileBytes, err := ioutil.ReadAll(photo)
	if err != nil {
		return err
	}
	// 判斷圖片種類
	fileExtension := getFileExtension(info.Filename)
	// 壓縮圖片
	compressData, err := compressImage(fileBytes, fileExtension)
	if err != nil {
		return err
	}
	err = s.UserRepository.SaveUserPhoto(ctx, userId, compressData)
	if err != nil {
		return err
	}

	return nil
}

func (s *service) GetUserPhoto(ctx context.Context, userId string) ([]byte, error) {
	photo, err := s.UserRepository.GetUserPhoto(ctx, userId)
	if err != nil {
		return nil, err
	}
	return photo, nil
}

func (s *service) UseEmailGetUser(ctx context.Context, email string) (*definitions.User, error) {
	user, err := s.UserRepository.UseEmailGetUser(ctx, email)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *service) AddFriend(ctx context.Context, userId string, req *definitions.AddFriendReq, friend *definitions.User) (*definitions.Friend, error) {
	result, err := s.UserRepository.AddFriend(ctx, userId, req, friend)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (s *service) GetFriends(ctx context.Context, userId string, invitationStatus string) ([]*definitions.GetFriendsRes, error) {
	friendIdList, err := s.UserRepository.GetListFromFriends(ctx, userId, invitationStatus)
	if err != nil {
		return nil, err
	}
	if len(friendIdList) == 0 {
		var emptySlice []*definitions.GetFriendsRes
		return emptySlice, nil
	}
	userList, err := s.UserRepository.GetListFromUsers(ctx, userId, friendIdList, invitationStatus)
	if err != nil {
		return nil, err
	}
	return userList, err
}

func (s *service) GetGroup(ctx context.Context, userId string) ([]*definitions.GetChatRoomsRes, error) {
	return s.UserRepository.GetGroup(ctx, userId)
}

func (s *service) ModifyFriendStatus(ctx context.Context, userId string, friendId string, invitationStatus string) error {
	err := s.UserRepository.ModifyFriendStatus(ctx, userId, friendId, invitationStatus)
	if err != nil {
		return err
	}
	return nil
}
