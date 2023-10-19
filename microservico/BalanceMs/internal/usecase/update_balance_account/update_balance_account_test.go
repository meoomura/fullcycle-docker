package update_balance_account

import (
	"errors"
	"testing"

	"github.com/meoomura/fullcycle/microservico/balancems/internal/entity"
	"github.com/meoomura/fullcycle/microservico/balancems/internal/usecase/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetAccountUseCase_Execute(t *testing.T) {
	account := entity.NewAccount("1", 100)

	accountMock := &mocks.AccountGatewayMock{}
	accountMock.On("Get", mock.Anything).Return(account, nil)
	accountMock.On("UpdateBalance", mock.Anything).Return(nil)

	uc := NewUpdateBalanceAccountOutputDTO(accountMock)

	inputDTO := UpdateBalanceAccountInputDTO{
		ID:      account.ID,
		Balance: 200,
	}

	err := uc.Execute(inputDTO)
	assert.Nil(t, err)
	accountMock.AssertExpectations(t)
	accountMock.AssertNumberOfCalls(t, "Get", 1)
	accountMock.AssertNumberOfCalls(t, "UpdateBalance", 1)

}

func TestGetAccountUseCase_Execute_NewAccount(t *testing.T) {
	var account entity.Account
	accountMock := &mocks.AccountGatewayMock{}
	accountMock.On("Get", mock.Anything).Return(&account, errors.New("id is required"))
	accountMock.On("Save", mock.Anything).Return(nil)

	uc := NewUpdateBalanceAccountOutputDTO(accountMock)

	inputDTO := UpdateBalanceAccountInputDTO{
		ID:      "1",
		Balance: 200,
	}

	err := uc.Execute(inputDTO)
	assert.Nil(t, err)
	accountMock.AssertExpectations(t)
	accountMock.AssertNumberOfCalls(t, "Get", 1)
	accountMock.AssertNumberOfCalls(t, "Save", 1)

}
