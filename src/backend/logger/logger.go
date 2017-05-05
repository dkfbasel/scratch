package logger

import (
	"os"

	"go.uber.org/zap"
)

var logger *zap.Logger

func init() {

	debug := os.Getenv("DEBUG")

	// define a looger
	if debug == "true" {
		logger, _ = zap.NewDevelopment()
	} else {
		logger, _ = zap.NewProduction()
	}

}

// Zap will return an initialized go.uber.org/zap logger
func Zap() *zap.Logger {
	return logger
}
