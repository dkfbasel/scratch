package sampleHandlers

import (
	"fmt"
	"net/http"

	"bitbucket.org/dkfbasel/scratch/src/backend/environment"
	"github.com/labstack/echo"
	"go.uber.org/zap"
)

// GetSample will return the sample value to the given id
func GetSample(env environment.Items) echo.HandlerFunc {

	return func(ctx echo.Context) error {
		sampleID := ctx.Param("id")

		if sampleID == "" {
			return echo.NewHTTPError(http.StatusBadRequest, "please provide all values")
		}

		sampleValue := env.SampleDB.Get(sampleID)
		return ctx.String(http.StatusOK, sampleValue)
	}
}

// SetSample will set the value for the given key
func SetSample(env environment.Items) echo.HandlerFunc {

	return func(ctx echo.Context) error {

		sampleID := ctx.Param("id")
		sampleValue := ctx.Param("value")

		if sampleID == "" || sampleValue == "" {
			return echo.NewHTTPError(http.StatusBadRequest, "please provide all values")
		}

		err := env.SampleDB.Set(sampleID, sampleValue)
		if err != nil {
			env.Logger.Error("setSampleRequest failed", zap.Error(err))
			return echo.NewHTTPError(http.StatusBadRequest, "could not set the value")
		}

		return ctx.String(http.StatusOK, fmt.Sprintf("%s: %s", sampleID, sampleValue))
	}
}
