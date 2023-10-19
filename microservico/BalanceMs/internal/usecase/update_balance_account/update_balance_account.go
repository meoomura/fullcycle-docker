package update_balance_account

import (
	"github.com/meoomura/fullcycle/microservico/balancems/internal/entity"
	"github.com/meoomura/fullcycle/microservico/balancems/internal/gateway"
)

type UpdateBalanceAccountInputDTO struct {
	ID      string  `json:"id"`
	Balance float64 `json:"balance"`
}

type UpdateBalanceAccountUseCase struct {
	AccountGateway gateway.AccountGateway
}

func NewUpdateBalanceAccountOutputDTO(a gateway.AccountGateway) *UpdateBalanceAccountUseCase {
	return &UpdateBalanceAccountUseCase{
		AccountGateway: a,
	}
}

func (uc *UpdateBalanceAccountUseCase) Execute(input UpdateBalanceAccountInputDTO) error {
	account, err := uc.AccountGateway.Get(input.ID)
	if err != nil {
		accountNew := entity.NewAccount(input.ID, input.Balance)
		errSave := uc.AccountGateway.Save(accountNew)
		if errSave != nil {
			return err
		}
	} else {
		account.UpdateBalance(input.Balance)
		err = uc.AccountGateway.UpdateBalance(account)
		if err != nil {
			return err
		}
	}

	return nil
}
