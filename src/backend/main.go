package main

import (
	"bitbucket.org/dkfbasel/scratch/src/backend/environment"
	"bitbucket.org/dkfbasel/scratch/src/backend/repository"
	"bitbucket.org/dkfbasel/scratch/src/backend/sampleHandlers"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/uber-go/zap"
)

func main() {

	// initialize the environment
	env := environment.Items{}

	// initialize a new logger
	env.Logger = zap.New(zap.NewJSONEncoder(zap.NoTime()))

	// initialize a default error variable
	var err error

	// load the configuration
	env.Config, err = environment.LoadConfiguration("config.yaml")
	if err != nil {
		env.Logger.Fatal("configuration could not be loaded", zap.Error(err))
	}

	// initialize a database connnection
	env.SampleDB, err = repository.NewSampleDB()
	if err != nil {
		env.Logger.Fatal("cound not connect to the database", zap.Error(err))
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
	router.GET("/", sampleHandlers.HelloWorld)
	router.GET("/err", sampleHandlers.ErrorExample(env))

	router.GET("/set/:id/:value", sampleHandlers.SetSample(env))
	router.GET("/get/:id", sampleHandlers.GetSample(env))

	// start the server
	err = router.Start(env.Config.Host)

	// log the error if server cannot be started or is terminated unexpectedly
	env.Logger.Fatal("could not start server", zap.Error(err))

}
