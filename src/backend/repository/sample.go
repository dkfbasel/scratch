package repository

import "sync"

// SampleDBInterface defines the methods required to handle sample information
type SampleDBInterface interface {
	Get(sampleID string) string
	Set(sampleID, value string) error
}

// SampleDB will implement the method to satisfy the sampleDBInterface
type SampleDB struct {
	Content map[string]string
	sync.RWMutex
}

// NewSampleDB will return an initialized sample database
func NewSampleDB() (*SampleDB, error) {
	// initialize the sample database
	sampleDB := SampleDB{}
	sampleDB.Content = make(map[string]string)
	return &sampleDB, nil
}

// Get will return the given sample id or an empty string if not present
func (db *SampleDB) Get(sampleID string) string {
	db.RLock()
	defer db.RUnlock()
	return db.Content[sampleID]
}

// Set will set the given sample in the database
func (db *SampleDB) Set(sampleID, value string) error {
	db.Lock()
	defer db.Unlock()
	db.Content[sampleID] = value
	return nil
}
