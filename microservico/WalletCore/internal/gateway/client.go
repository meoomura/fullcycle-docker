package gateway

import (
	"meoomura/fullcycle/microservico/wallet/internal/entity"
)

type ClientGateway interface {
	Get(id string) (*entity.Client, error)
	Save(client *entity.Client) error
}
