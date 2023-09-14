package user

import (
	"chat-server/definitions"
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

const (
	SEND    = "send"
	PENDING = "pending"
	CONFIRM = "confirm"
	REFUSE  = "refuse"
)

type repository struct {
	db definitions.DBTX
}

func NewRepository(db definitions.DBTX) definitions.UserRepository {
	return &repository{db: db}
}

func (r *repository) CheckEmailIsUsed(ctx context.Context, email string) bool {
	isEmailExistQuery := "SELECT COUNT(*) FROM users WHERE email = $1"
	var count int
	row := r.db.QueryRowContext(ctx, isEmailExistQuery, email)
	err := row.Scan(&count)
	if err != nil {
		fmt.Println(err.Error())
	}
	if count > 0 {
		return true
	}
	return false
}

func (r *repository) GetUser(ctx context.Context, userId string) (*definitions.UserRes, error) {
	searchStmt := `
	SELECT id, username, email, photo, COALESCE(status, '')
	FROM users
	where id = $1
	`
	row := r.db.QueryRowContext(ctx, searchStmt, userId)
	user := &definitions.UserRes{}
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Photo, &user.Status)
	if err != nil {
		return user, err
	}
	return user, nil
}

func (r *repository) CreateUser(ctx context.Context, user *definitions.User) (*definitions.User, error) {
	// 創建使用者資料
	userId := uuid.New().String()
	insertQuery := "INSERT INTO users(id, username, password, email, photo) VALUES ($1, $2, $3, $4, $5) RETURNING id"
	_, err := r.db.ExecContext(ctx, insertQuery, userId, user.Username, user.Password, user.Email, "")
	if err != nil {
		return &definitions.User{}, err
	}

	// 重新取得創建後的資料
	selectStmt := `
		SELECT id, username, email
		FROM users
		WHERE id = $1
	`
	row := r.db.QueryRowContext(ctx, selectStmt, userId)
	createUser := &definitions.User{}
	err = row.Scan(&createUser.ID, &createUser.Username, &createUser.Email)
	if err != nil {
		fmt.Println(err.Error())
	}
	return createUser, nil
}

func (r *repository) UpdateUser(ctx context.Context, user *definitions.UpdateUserReq) (*definitions.User, error) {
	// 更新使用者資料
	updateStmt := `
        UPDATE users
        SET 
            username = CASE WHEN $2 <> '' THEN $2 ELSE username END,
            email = CASE WHEN $3 <> '' THEN $3 ELSE email END,
            password = CASE WHEN $4 <> '' THEN $4 ELSE password END,
            status = CASE WHEN $5 <> '' THEN $5 ELSE status END
        WHERE id = $1
    `

	_, err := r.db.ExecContext(ctx, updateStmt, user.ID, user.Username, user.Email, user.Password, user.Status)
	if err != nil {
		return &definitions.User{}, err
	}

	// 重新取得更新後的資料
	selectStmt := `
		SELECT id, username, email, status
		FROM users
		WHERE id = $1
	`
	row := r.db.QueryRowContext(ctx, selectStmt, user.ID)
	updateUser := &definitions.User{}
	err = row.Scan(&updateUser.ID, &updateUser.Username, &updateUser.Email, &updateUser.Status)
	if err != nil {
		fmt.Println(err.Error())
	}
	return updateUser, nil
}

func (r *repository) SaveUserPhoto(ctx context.Context, userId string, photo []byte) error {
	var err error
	updateStmt := `
		UPDATE users
		SET photo = $2
		WHERE id = $1
	`
	_, err = r.db.ExecContext(ctx, updateStmt, userId, photo)
	if err != nil {
		return err
	}
	return nil
}

func (r *repository) GetUserPhoto(ctx context.Context, userId string) ([]byte, error) {
	getStmt := `
		SELECT photo
		FROM users
		where id = $1
	`
	var photo []byte
	row, err := r.db.QueryContext(ctx, getStmt, userId)
	if err != nil {
		return nil, err
	}
	if row.Next() {
		err := row.Scan(&photo)
		if err != nil {
			return nil, err
		}
	}
	return photo, nil
}

func (r *repository) UseEmailGetUser(ctx context.Context, email string) (*definitions.User, error) {
	getUserStmt := `
	SELECT id, userName, email
	FROM USERS
	WHERE email = $1
	`
	row := r.db.QueryRowContext(ctx, getUserStmt, email)
	user := &definitions.User{}
	err := row.Scan(&user.ID, &user.Username, &user.Email)
	if err != nil {
		fmt.Println(err.Error())
	}
	return user, nil
}

func (r *repository) AddFriend(ctx context.Context, userId string, req *definitions.AddFriendReq, friend *definitions.User) (*definitions.Friend, error) {
	// 一次寫入兩筆資料，其中一筆是使用者，另一筆是欲加入好友的好友狀態資料
	addFriendStmt := `
	INSERT INTO friends(id, friend_id, invitation_status, invitation_message) 
	VALUES ($1, $2, $3, $4), ($2, $1, $5, $4)
	`
	_, err := r.db.ExecContext(ctx, addFriendStmt, userId, friend.ID, SEND, req.InvitationMessage, PENDING)
	if err != nil {
		return &definitions.Friend{}, err
	}
	return &definitions.Friend{}, nil
}

func (r *repository) GetListFromFriends(ctx context.Context, userId string, invitationStatus string) ([]string, error) {
	searchStmt := `
	SELECT friend_id
	FROM friends
	where id = $1 AND invitation_status = $2
	`
	rows, err := r.db.QueryContext(ctx, searchStmt, userId, invitationStatus)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []string
	for rows.Next() {
		var id string
		err := rows.Scan(&id)
		if err != nil {
			return nil, err
		}
		list = append(list, id)
	}
	return list, nil
}

func (r *repository) GetListFromUsers(ctx context.Context, userId string, friendIdList []string, friendStatus string) ([]*definitions.GetFriendsRes, error) {
	var searchStmt string
	if friendStatus == CONFIRM {
		searchStmt = `
		SELECT 
		    u.id,
		    COALESCE(f.nickname, u.username) AS username, 
		    u.email, 
		    u.photo,
		    COALESCE(u.status, ''),
		    f.invitation_message
		FROM users as u
		LEFT JOIN  friends as f ON u.id = f.id
		WHERE u.id = ANY($2) AND f.friend_id = $1
		`
	} else {
		searchStmt = `
		SELECT u.id, u.username, u.email, u.photo, COALESCE(u.status, ''), f.invitation_message
		FROM users as u
		LEFT JOIN friends as f ON u.id = f.id
		WHERE u.id = ANY($2) AND f.friend_id = $1
		`
	}
	rows, err := r.db.QueryContext(ctx, searchStmt, userId, pq.Array(friendIdList))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []*definitions.GetFriendsRes
	for rows.Next() {
		var user definitions.GetFriendsRes
		err := rows.Scan(&user.ID, &user.Username, &user.Email, &user.Photo, &user.Status, &user.InvitationMessage)
		if err != nil {
			return nil, err
		}
		list = append(list, &user)
	}
	return list, nil
}

func (r *repository) ModifyFriendStatus(ctx context.Context, userId string, friendId string, invitationStatus string) error {
	var modifyStmt string
	if invitationStatus == REFUSE {
		modifyStmt = `
		DELETE FROM friends
		WHERE (id = $1 AND friend_id = $2) OR (id = $2 AND friend_id = $1)
		`
		_, err := r.db.ExecContext(ctx, modifyStmt, userId, friendId)
		if err != nil {
			return err
		}
		return nil
	} else {
		modifyStmt = `
		UPDATE friends
		SET
	    	invitation_status = $3
		WHERE (id = $1 AND friend_id = $2) OR (id = $2 AND friend_id = $1)
		`
		_, err := r.db.ExecContext(ctx, modifyStmt, userId, friendId, invitationStatus)
		if err != nil {
			return err
		}
		//if invitationStatus == CONFIRM {
		//	chatRoomId := uuid.New().String()
		//	createChatRoomStmt := `
		//	INSERT INTO chat_rooms(chat_room_id, chat_room_name,chat_room_type,chat_room_photo) VALUES ($1,$2,$3,$4)
		//	`
		//	_, err := r.db.ExecContext(ctx, createChatRoomStmt, chatRoomId, "", "private", "")
		//	if err != nil {
		//		return err
		//	}
		//	membersId := []string{userId, friendId}
		//	for _, id := range membersId {
		//		createChatMembersStmt := `
		//		INSERT INTO chat_rooms_members(chat_room_id,user_id) VALUES ($1, $2)
		//		`
		//		_, err := r.db.ExecContext(ctx, createChatMembersStmt, chatRoomId, id)
		//		if err != nil {
		//			return err
		//		}
		//	}
		//}
		return nil
	}

}

func (r *repository) GetGroup(ctx context.Context, userId string) ([]*definitions.GetChatRoomsRes, error) {
	getChatRoomStmt := `
    SELECT 
        cr.chat_room_id,
        cr.chat_room_name,
        cr.chat_room_type,
        cr.chat_room_photo
    FROM chat_rooms AS cr
    INNER JOIN chat_rooms_members AS crm ON cr.chat_room_id = crm.chat_room_id
    WHERE cr.chat_room_type = 'group' AND crm.user_id = $1;
	`
	chatRoomRows, err := r.db.QueryContext(ctx, getChatRoomStmt, userId)
	if err != nil {
		return nil, err
	}
	var chatRoomList []*definitions.ChatRoom
	for chatRoomRows.Next() {
		var chatRoom definitions.ChatRoom
		err := chatRoomRows.Scan(&chatRoom.ID, &chatRoom.Name, &chatRoom.Type, &chatRoom.Photo)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		chatRoomList = append(chatRoomList, &chatRoom)
	}
	var chatRoomResList []*definitions.GetChatRoomsRes
	for _, chatRoom := range chatRoomList {
		getUserIdStmt := `
		SELECT user_id
		FROM chat_rooms_members
		WHERE chat_room_id = $1
        `
		userIdRows, err := r.db.QueryContext(ctx, getUserIdStmt, chatRoom.ID)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		var userIdList []string
		for userIdRows.Next() {
			var userId string
			err := userIdRows.Scan(&userId)
			if err != nil {
				fmt.Println(err)
				return nil, err
			}
			userIdList = append(userIdList, userId)
		}
		getMemberStmt := `
		SELECT id, username, photo
		FROM users
		WHERE id = ANY($1) AND id != $2
		`
		var memberList []*definitions.Member
		memberRows, err := r.db.QueryContext(ctx, getMemberStmt, pq.Array(userIdList), userId)
		for memberRows.Next() {
			var member definitions.Member
			err := memberRows.Scan(&member.ID, &member.Name, &member.Photo)
			if err != nil {
				fmt.Println(err)
				return nil, err
			}
			memberList = append(memberList, &member)
		}
		chatRoomRes := &definitions.GetChatRoomsRes{
			ID:      chatRoom.ID,
			Name:    chatRoom.Name,
			Type:    chatRoom.Type,
			Photo:   chatRoom.Photo,
			Members: memberList,
		}
		chatRoomResList = append(chatRoomResList, chatRoomRes)
	}
	return chatRoomResList, nil
}
