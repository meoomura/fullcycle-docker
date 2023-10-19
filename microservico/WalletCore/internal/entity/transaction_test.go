package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateTransaction(t *testing.T) {
	client1, _ := NewClient("John Doe", "j@j.com")
	account1 := NewAccount(client1)

	client2, _ := NewClient("Mary Doe", "m@j.com")
	account2 := NewAccount(client2)

	account1.Credit(1000)
	account2.Credit(1000)

	transaction, err := NewTransaction(account1, account2, 200)
	assert.Nil(t, err)
	assert.NotNil(t, transaction)
	assert.Equal(t, transaction.AccountFromID, account1.ID)
	assert.Equal(t, transaction.AccountToID, account2.ID)
	assert.Equal(t, 1200.0, account2.Balance)
	assert.Equal(t, 800.0, account1.Balance)
}

func TestCreateTransactionWithInsuficientFunds(t *testing.T) {
	client1, _ := NewClient("John Doe", "j@j.com")
	account1 := NewAccount(client1)

	client2, _ := NewClient("Mary Doe", "m@j.com")
	account2 := NewAccount(client2)

	account1.Credit(1000)
	account2.Credit(1000)

	transaction, err := NewTransaction(account1, account2, 2000)
	assert.NotNil(t, err)
	assert.Error(t, err, "insuficient funds")
	assert.Nil(t, transaction)
	assert.Equal(t, 1000.0, account2.Balance)
	assert.Equal(t, 1000.0, account1.Balance)
}
