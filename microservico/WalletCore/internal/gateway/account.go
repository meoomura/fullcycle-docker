package gateway

import (
	"meoomura/fullcycle/microservico/wallet/internal/entity"
)

type AccountGateway interface {
	Get(id string) (*entity.Account, error)
	Save(account *entity.Account) error
}
