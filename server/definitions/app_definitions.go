package definitions

import (
	"context"
	"database/sql"
	"github.com/golang-jwt/jwt/v5"
)

const (
	SecretKey = "secret"
)

type MyJWTClaims struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type DefaultRes struct {
	IsSuccess bool        `json:"isSuccess"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data"`
}

type DBTX interface {
	// ExecContext 這個方法用於執行不返回資料行的查詢，例如INSERT、UPDATE或DELETE語句。它以context.Context作為第一個參數， 接著是查詢字串和可選的查詢參數。它返回一個sql.Result介面和一個錯誤。
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	// PrepareContext 這個方法用於準備稍後執行的SQL語句。它以context.Context作為第一個參數，接著是查詢字串。它返回一個指向sql.Stmt的指標和一個錯誤。
	PrepareContext(context.Context, string) (*sql.Stmt, error)
	// QueryContext 這個方法用於執行返回多個資料行的查詢。它以context.Context作為第一個參數，接著是查詢字串和可選的查詢參數。它返回一個指向sql.Rows的指標和一個錯誤。
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	// QueryRowContext 這個方法用於執行預期最多返回一行資料的查詢。它以context.Context作為第一個參數，接著是查詢字串和可選的查詢參數。它返回一個指向sql.Row的指標。
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}
