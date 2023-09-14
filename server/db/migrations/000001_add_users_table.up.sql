CREATE TABLE "users"
(
    "id"       varchar PRIMARY KEY,
    "username" varchar NOT NULL,
    "email"    varchar NOT NULL,
    "password" varchar NOT NULL,
    "photo"    bytea,
    "status"   varchar
);