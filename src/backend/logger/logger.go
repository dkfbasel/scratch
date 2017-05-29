package logger

import (
	"flag"
	"os"

	"go.uber.org/zap"
)

var logger *zap.Logger

func init() {

	// get the debugging env config
	debugMode := os.Getenv("DEBUG")

	// get the logging env config
	logLevel := os.Getenv("LOGLEVEL")

	// use the test logging mode if started with go test and no logging mode specified
	if logLevel == "" && flag.Lookup("test.v") != nil {
		logLevel = "test"
	}

	// use the debug logging mode if started in debug mode and no logging mode specified
	if logLevel == "" && debugMode == "true" {
		logLevel = "debug"
	}

	// use different logging output depending on configuration
	switch logLevel {
	case "debug":
		logger, _ = zap.NewDevelopment()

	case "test":
		logger = zap.NewNop()

	default:
		logger, _ = zap.NewProduction()
	}

}

// Zap will return an initialized go.uber.org/zap logger
func Zap() *zap.Logger {
	return logger
}
