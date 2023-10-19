package gateway

import "meoomura/fullcycle/microservico/wallet/internal/entity"

type TransactionGateway interface {
	Create(client *entity.Transaction) error
}
