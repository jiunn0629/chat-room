CREATE TABLE "chat_rooms"
(
    "chat_room_id" varchar PRIMARY KEY NOT NULL,
    "chat_room_name" varchar not null,
    "chat_room_type" varchar not null,
    "chat_room_photo" bytea,
    "message" jsonb[]
);

CREATE TABLE "chat_rooms_members"
(
    "chat_room_id" varchar REFERENCES "chat_rooms" ("chat_room_id"),
    "user_id" varchar REFERENCES "users" ("id"),
    PRIMARY KEY ("chat_room_id", "user_id")
);

CREATE TABLE "chat_messages"
(
    "message_id" serial PRIMARY KEY,
    "chat_room_id" varchar REFERENCES "chat_rooms" ("chat_room_id"),
    "sender_id" varchar,
    "content" text NOT NULL,
    "timestamp" BIGINT NOT NULL
);