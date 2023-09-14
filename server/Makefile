postgresinit:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=example -e POSTGRES_PASSWORD=example -e POSTGRES_DB=example

postgres:
	docker exec -it postgres psql --username=example

createdb:
	docker exec -it postgres createdb --username=example --owner=example chat

dropdb:
	docker exec -it postgres dropdb chat

migrateup:
	migrate -path db/migrations -database "postgresql://example:example@localhost:5432/chat?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migrations -database "postgresql://example:example@localhost:5432/chat?sslmode=disable" -verbose down

migrateversion:
	migrate -path db/migrations -database "postgresql://example:example@localhost:5432/chat?sslmode=disable" version

.PHONY: postgresinit postgres createdb dropdb migrateup migratedown migrateversion