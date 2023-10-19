package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateNewAccount(t *testing.T) {
	account := NewAccount("1", 100)
	assert.NotNil(t, account)
	assert.Equal(t, account.ID, "1")
	assert.Equal(t, account.Balance, 100.0)
}

func TestUpdateBalance(t *testing.T) {
	account := NewAccount("1", 100)
	account.UpdateBalance(200)
	assert.NotNil(t, account)
	assert.Equal(t, account.ID, "1")
	assert.Equal(t, account.Balance, 200.0)
}
