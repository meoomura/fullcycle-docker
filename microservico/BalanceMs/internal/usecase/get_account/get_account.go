package get_account

import (
	"time"

	"github.com/meoomura/fullcycle/microservico/balancems/internal/gateway"
)

type GetAccountInputDTO struct {
	ID string `json:"id"`
}

type GetAccountOutputDTO struct {
	ID        string    `json:"id"`
	Balance   float64   `json:"balance"`
	UpdatedAt time.Time `json:"updated_at"`
}

type GetAccountUseCase struct {
	AccountGateway gateway.AccountGateway
}

func NewGetAccountOutputDTO(a gateway.AccountGateway) *GetAccountUseCase {
	return &GetAccountUseCase{
		AccountGateway: a,
	}
}

func (uc *GetAccountUseCase) Execute(input GetAccountInputDTO) (*GetAccountOutputDTO, error) {
	account, err := uc.AccountGateway.Get(input.ID)
	if err != nil {
		return nil, err
	}
	return &GetAccountOutputDTO{
		ID:        account.ID,
		Balance:   account.Balance,
		UpdatedAt: account.UpdatedAt,
	}, nil
}
