package kafka

import (
	"encoding/json"
	"fmt"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/meoomura/fullcycle/microservico/balancems/internal/database"
	"github.com/meoomura/fullcycle/microservico/balancems/internal/usecase/update_balance_account"
	"github.com/meoomura/fullcycle/microservico/balancems/pkg/kafka"
)

type BalanceUpdatedInputDTO struct {
	Name    string `json:"Name"`
	Payload struct {
		AccountIDFrom        string  `json:"account_id_from"`
		AccountIDTo          string  `json:"account_id_to"`
		BalanceAccountIDFrom float64 `json:"balance_account_id_from"`
		BalanceAccountIDTo   float64 `json:"balance_account_id_to"`
	} `json:"Payload"`
}

type KafkaProcessor struct {
	ConfigMap *ckafka.ConfigMap
	AccountDb *database.AccountDB
}

func NewKafkaProcessor(configMap *ckafka.ConfigMap, accountDb *database.AccountDB) *KafkaProcessor {
	return &KafkaProcessor{
		ConfigMap: configMap,
		AccountDb: accountDb,
	}
}

func (k *KafkaProcessor) Consume() {
	updateBalanceAccountUseCase := update_balance_account.NewUpdateBalanceAccountOutputDTO(k.AccountDb)

	topics := []string{"balances"}
	kafkaConsumer := kafka.NewConsumer(k.ConfigMap, topics)

	balanceChan := make(chan *ckafka.Message)

	go kafkaConsumer.Consume(balanceChan)
	go func() {
		for msg := range balanceChan {
			var balanceUpdatedInputDTO BalanceUpdatedInputDTO
			if err := json.Unmarshal([]byte(msg.Value), &balanceUpdatedInputDTO); err != nil {
				fmt.Printf("Error decoding Kafka message: %v\n", err)
			} else {
				inputFrom := update_balance_account.UpdateBalanceAccountInputDTO{
					ID:      balanceUpdatedInputDTO.Payload.AccountIDFrom,
					Balance: balanceUpdatedInputDTO.Payload.BalanceAccountIDFrom,
				}
				err = updateBalanceAccountUseCase.Execute(inputFrom)
				if err != nil {
					fmt.Printf("Error on update balance account %s: ,%v\n", inputFrom.ID, err)
				}
				inputTo := update_balance_account.UpdateBalanceAccountInputDTO{
					ID:      balanceUpdatedInputDTO.Payload.AccountIDTo,
					Balance: balanceUpdatedInputDTO.Payload.BalanceAccountIDTo,
				}
				err = updateBalanceAccountUseCase.Execute(inputTo)
				if err != nil {
					fmt.Printf("Error on update balance account %s: ,%v\n", inputTo.ID, err)
				}

				// fmt.Printf("Name: %s\n", balanceUpdatedInputDTO.Name)
				// fmt.Printf("account_id_from: %s\n", balanceUpdatedInputDTO.Payload.AccountIDFrom)
				// fmt.Printf("account_id_to: %s\n", balanceUpdatedInputDTO.Payload.AccountIDTo)
				// fmt.Printf("balance_account_id_from: %f\n", balanceUpdatedInputDTO.Payload.BalanceAccountIDFrom)
				// fmt.Printf("balance_account_id_to: %f\n", balanceUpdatedInputDTO.Payload.BalanceAccountIDTo)
			}
		}
	}()
}
