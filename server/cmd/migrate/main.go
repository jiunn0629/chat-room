package main

import (
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	m, err := migrate.New(
		"file://./db/migrations",
		"sqlite3://./chat.db")
	if err != nil {
		panic(err)
	}
	err = m.Steps(2)
	if err != nil {
		panic(fmt.Errorf("migrate step error: %v", err))
		return
	}
}
