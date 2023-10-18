package gateway

import github.com/mura/fullcycle/microservico/wallet/internal/entity"

type TransactionGateway interface {
	Create(client *entity.Transaction) error
}
