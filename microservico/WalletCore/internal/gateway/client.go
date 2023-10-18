package gateway

import (
	"github.com/meoomura/fullcycle/microservico/wallet/internal/entity"
)

type ClientGateway interface {
	Get(id string) (*entity.Client, error)
	Save(client *entity.Client) error
}
