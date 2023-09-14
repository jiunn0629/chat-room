CREATE TABLE "friends"
(
    "id"                 varchar NOT NULL,
    "friend_id"          varchar NOT NULL,
    "nickname"           varchar,
    "invitation_status"  varchar,
    "invitation_message" varchar,
    PRIMARY KEY ("id", "friend_id"),
    FOREIGN KEY ("id") REFERENCES "users" ("id"),
    FOREIGN KEY ("friend_id") REFERENCES "users" ("id")
);