package environment

import (
	"bitbucket.org/dkfbasel/scratch/src/backend/repository"
	"go.uber.org/zap"
	"github.com/kelseyhightower/envconfig"
)

// --- Globally available items ---

// Items is used for globally necessary items
type Items struct {
	// define a global logger
	Logger *zap.Logger

	// make the configuration available globally
	Config Configuration

	// define a global database
	SampleDB repository.SampleDBInterface
}

// --- Basic application configuration ---

// Configuration is used to hold basic application configuration
type Configuration struct {
	Host       string `default:"0.0.0.0:80"`
	RequestLog bool   `default:"false"`
}

// LoadConfiguration will load the basic application configuration from the
// specified config file
func LoadConfiguration(prefix string) (Configuration, error) {
	config := Configuration{}
	err := envconfig.Process(prefix, &config)
	return config, err
}
