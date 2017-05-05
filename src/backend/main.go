package main

import (
	"bitbucket.org/dkfbasel/scratch/src/backend/environment"
	"bitbucket.org/dkfbasel/scratch/src/backend/logger"
	"bitbucket.org/dkfbasel/scratch/src/backend/repository"
	"bitbucket.org/dkfbasel/scratch/src/backend/samplehandlers"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"go.uber.org/zap"
)

func main() {

	// initialize the environment
	env := environment.Spec{}

	// initialize a default error variable
	var err error

	// use a central logging package, this will allow us to use the logger
	// in various packages without having to pass a reference
	testLogger := logger.Zap().With(zap.String("user", "testuser"))

	testLogger.Info("this is a sample setup")
	testLogger.Debug("debug information is not shown in production setting")

	// load the configuration
	env.Config, err = environment.LoadConfiguration("scratch")
	if err != nil {
		logger.Zap().Fatal("configuration could not be loaded", zap.Error(err))
	}

	// initialize a database connnection
	env.SampleDB, err = repository.NewSampleDB()
	if err != nil {
		logger.Zap().Fatal("cound not connect to the database", zap.Error(err))
	}

	// initialize a new router
	router := echo.New()

	// add basic logging functionality
	if env.Config.RequestLog {
		router.Use(middleware.Logger())
	}

	// add security middleware
	router.Use(middleware.Secure())

	// default router
	router.GET("/", samplehandlers.HelloWorld)
	router.GET("/err", samplehandlers.ErrorExample(env))

	router.GET("/set/:id/:value", samplehandlers.SetSample(env))
	router.GET("/get/:id", samplehandlers.GetSample(env))

	logger.Zap().Info("starting server", zap.String("host", env.Config.Host))
	if env.Config.RequestLog {
		logger.Zap().Info("request logging activated")
	}

	// start the server
	err = router.Start(env.Config.Host)

	// log the error if server cannot be started or is terminated unexpectedly
	logger.Zap().Fatal("could not start server", zap.Error(err))

}
