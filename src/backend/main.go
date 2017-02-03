package main

import "github.com/uber-go/zap"

func main() {

	logger := zap.New(zap.NewJSONEncoder(zap.NoTime()))
	logger.Info("This is the starting point of the application")

}
