package samplehandlers

import (
	"net/http"

	"github.com/labstack/echo"
)

// HelloWorld will print a hello world message
func HelloWorld(ctx echo.Context) error {
	return ctx.String(http.StatusOK, "Greetings Earthlings!")
}
