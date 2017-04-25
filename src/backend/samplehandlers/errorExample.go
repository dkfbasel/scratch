package sampleHandlers

import (
	"fmt"
	"net/http"

	"bitbucket.org/dkfbasel/scratch/src/backend/environment"
	"github.com/labstack/echo"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

// ErrorExample will return an error
func ErrorExample(env environment.Items) echo.HandlerFunc {

	return func(ctx echo.Context) error {

		value, err := returnAnError("my sample value")
		if err != nil {
			env.Logger.Error("errorExample request did not work", zap.Error(err))
			return echo.NewHTTPError(http.StatusInternalServerError, "sorry. something did not work")
		}

		return ctx.String(http.StatusOK, value)

	}
}

// returnAnError is a function that will return an error to illustrate error
// handling
func returnAnError(value string) (string, error) {
	// error that would be produced i.e. by a database call that failed
	err := fmt.Errorf("This is a new error, i.e. from a database call")

	// wrapped error with additional information
	return "", errors.Wrap(err, "I always return an error")

}
