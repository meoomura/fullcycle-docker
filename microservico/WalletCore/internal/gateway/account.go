package gateway

import (
	"github.com/meoomura/fullcycle/microservico/wallet/internal/entity"
)

type AccountGateway interface {
	Get(id string) (*entity.Account, error)
	Save(account *entity.Account) error
	UpdateBalance(account *entity.Account) error
}
