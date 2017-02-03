package main

import "github.com/jinzhu/configor"

// --- Basic application configuration ---

// Configuration is used to hold basic application configuration
type Configuration struct {
	Host string `default:"0.0.0.0:80" env:"SRC"`
}

// loadConfiguration will load the basic application configuration from the
// specified config file
func loadConfiguration(filepath string) (Configuration, error) {
	config := Configuration{}
	err := configor.Load(&config, filepath)
	return config, err
}
