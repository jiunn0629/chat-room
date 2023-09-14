package chat_room

import (
	"chat-server/definitions"
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type repository struct {
	db definitions.DBTX
}

func NewRepository(db definitions.DBTX) definitions.ChatRoomRepository {
	return &repository{db: db}
}

func (r *repository) CreateChatRoom(ctx context.Context, req *definitions.CreateChatRoomReq) (string, error) {
	id := uuid.New().String()
	createChatRoomStmt := `
	INSERT INTO chat_rooms(chat_room_id, chat_room_name, chat_room_type, chat_room_photo) VALUES ($1,$2,$3,$4) RETURNING chat_room_id
	`
	var chatRoomId string
	err := r.db.QueryRowContext(ctx, createChatRoomStmt, id, req.Name, req.Type, req.Photo).Scan(&chatRoomId)
	if err != nil {
		return "", err
	}
	for _, memberId := range req.MembersID {
		createChatMembersStmt := `
		INSERT INTO chat_rooms_members(chat_room_id, user_id) VALUES ($1,$2) RETURNING chat_room_id
		`
		_, err := r.db.ExecContext(ctx, createChatMembersStmt, id, memberId)
		if err != nil {
			return "", err
		}
	}
	return chatRoomId, nil
}

func (r *repository) GetChatRoomMessage(ctx context.Context, chatRoomId string) ([]*definitions.Message, error) {
	getStmt := `
	SELECT message_id, chat_room_id,sender_id,content,timestamp
	FROM chat_messages
	WHERE chat_room_id = $1
    `
	rows, err := r.db.QueryContext(ctx, getStmt, chatRoomId)
	if err != nil {
		return nil, err
	}
	var messageList []*definitions.Message
	for rows.Next() {
		var message definitions.Message
		err := rows.Scan(&message.MessageId, &message.ChatRoomId, &message.SenderId, &message.Content, &message.Timestamp)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		messageList = append(messageList, &message)
	}
	return messageList, err
}

func (r *repository) UseUserIdGetChatRoomsId(ctx context.Context, userId string) ([]string, error) {
	getStmt := `
	SELECT chat_room_id
	FROM chat_rooms_members
	WHERE user_id = $1
	`
	rows, err := r.db.QueryContext(ctx, getStmt, userId)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	var list []string
	for rows.Next() {
		var chatRoomId string
		err := rows.Scan(&chatRoomId)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		list = append(list, chatRoomId)
	}
	return list, err
}

func (r *repository) UseChatRoomsIdGetMembers(ctx context.Context, chatRoomId string, userId string) []*definitions.Member {
	getUserIdStmt := `
	SELECT user_id
	FROM chat_rooms_members
	WHERE chat_room_id = $1
	`
	userIdRows, err := r.db.QueryContext(ctx, getUserIdStmt, chatRoomId)
	if err != nil {
		fmt.Println(err)
		return make([]*definitions.Member, 0)
	}
	var userIdList []string
	for userIdRows.Next() {
		var userId string
		err := userIdRows.Scan(&userId)
		if err != nil {
			fmt.Println(err)
			return make([]*definitions.Member, 0)
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
			return make([]*definitions.Member, 0)
		}
		memberList = append(memberList, &member)
	}
	return memberList
}

func (r *repository) UseChatRoomsIdGetChatRoom(ctx context.Context, chatRoomId string, userId string) *definitions.ChatRoom {
	getStmt := `
	SELECT
	    cr.chat_room_id,
	    CASE WHEN cr.chat_room_type = 'private' THEN COALESCE(f.nickname, u.username)
	    	ELSE cr.chat_room_name END AS chat_room_name,
	    cr.chat_room_type,
	    CASE WHEN cr.chat_room_type = 'private' THEN u.photo
	    	ELSE cr.chat_room_photo END AS chat_room_photo,
		COALESCE(cm.timestamp, 0) AS chat_room_last_modify

	FROM
	    chat_rooms cr
	LEFT JOIN
	    chat_rooms_members crm ON cr.chat_room_id = crm.chat_room_id AND crm.user_id != $2
	LEFT JOIN
	    users u ON crm.user_id = u.id
	LEFT JOIN
	    friends f ON crm.user_id = f.id
	LEFT JOIN
		(SELECT "chat_room_id", MAX("timestamp") AS "timestamp" FROM chat_messages GROUP BY "chat_room_id") cm
	    ON cr.chat_room_id = cm."chat_room_id"
	
	WHERE
	    cr.chat_room_id = $1;
	`
	row := r.db.QueryRowContext(ctx, getStmt, chatRoomId, userId)
	var chatRoom definitions.ChatRoom
	err := row.Scan(&chatRoom.ID, &chatRoom.Name, &chatRoom.Type, &chatRoom.Photo, &chatRoom.LastModify)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return &chatRoom
}

func (r *repository) UseUserIdFriendIdGetChatRoomId(ctx context.Context, userId string, friendId string) (string, error) {
	getChatRoomIdStmt := `
	SELECT crm1."chat_room_id"
	FROM "chat_rooms_members" AS crm1
	INNER JOIN "chat_rooms_members" AS crm2 ON crm1."chat_room_id" = crm2."chat_room_id"
	WHERE crm1."user_id" = $1
  		AND crm2."user_id" = $2
  		AND crm1."chat_room_id" IN (
    		SELECT "chat_room_id" FROM "chat_rooms" WHERE "chat_room_type" = 'private'
  		);
	`
	row := r.db.QueryRowContext(ctx, getChatRoomIdStmt, userId, friendId)
	var chatRoomId string
	err := row.Scan(&chatRoomId)
	if err != nil {
		return "", err
	}
	return chatRoomId, nil
}

func (r *repository) WriteMessageToDB(ctx context.Context, msg *definitions.Message) (int64, error) {
	messageStmt := `
	INSERT INTO chat_messages (chat_room_id, sender_id, content, timestamp) VALUES ($1,$2,$3,$4) RETURNING message_id
    `
	var messageId int64
	err := r.db.QueryRowContext(ctx, messageStmt, msg.ChatRoomId, msg.SenderId, msg.Content, msg.Timestamp).Scan(&messageId)
	if err != nil {
		return 0, err
	}

	return messageId, nil
}
