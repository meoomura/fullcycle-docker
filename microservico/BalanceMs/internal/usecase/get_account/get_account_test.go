package get_account

import (
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

	uc := NewGetAccountOutputDTO(accountMock)

	inputDTO := GetAccountInputDTO{
		ID: account.ID,
	}

	AccountUc, err := uc.Execute(inputDTO)
	assert.Nil(t, err)
	accountMock.AssertExpectations(t)
	accountMock.AssertNumberOfCalls(t, "Get", 1)
	assert.Equal(t, AccountUc.ID, account.ID)
	assert.Equal(t, AccountUc.Balance, account.Balance)
	assert.Equal(t, AccountUc.UpdatedAt, account.UpdatedAt)

}
