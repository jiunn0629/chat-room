FROM golang:1.21-alpine

WORKDIR /srv/chat-room/src

COPY ./ /srv/chat-room/src

RUN go mod tidy

RUN go build -o /srv/chat-room/src/server cmd/server/main.go

WORKDIR /srv/chat-room/src

EXPOSE 8080

CMD ["./server"]