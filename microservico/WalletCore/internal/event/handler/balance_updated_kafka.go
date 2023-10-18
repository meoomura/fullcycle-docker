package handler

import (
	"fmt"
	"meoomura/fullcycle/microservico/wallet/pkg/events"
	"meoomura/fullcycle/microservico/wallet/pkg/kafka"
	"sync"
)

type UpdatedBalancekafkaHandler struct {
	Kafka *kafka.Producer
}

func NewUpdatedBalanceKafkaHandler(kafka *kafka.Producer) *UpdatedBalancekafkaHandler {
	return &UpdatedBalancekafkaHandler{
		Kafka: kafka,
	}
}

func (h *UpdatedBalancekafkaHandler) Handle(message events.EventInterface, wg *sync.WaitGroup) {
	defer wg.Done()
	h.Kafka.Publish(message, nil, "balances")
	fmt.Println("UpdatedBalancekafkaHandler called")
}
