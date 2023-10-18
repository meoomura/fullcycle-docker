package main

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/meoomura/fullcycle/microservico/wallet/internal/database"
	"github.com/meoomura/fullcycle/microservico/wallet/internal/event"
	"github.com/meoomura/fullcycle/microservico/wallet/internal/event/handler"
	"github.com/meoomura/fullcycle/microservico/wallet/internal/usecase/create_account"
	"github.com/meoomura/fullcycle/microservico/wallet/internal/usecase/create_client"
	"github.com/meoomura/fullcycle/microservico/wallet/internal/usecase/create_transaction"
	"github.com/meoomura/fullcycle/microservico/wallet/internal/web"
	"github.com/meoomura/fullcycle/microservico/wallet/internal/web/webserver"
	"github.com/meoomura/fullcycle/microservico/wallet/pkg/events"
	"github.com/meoomura/fullcycle/microservico/wallet/pkg/kafka"
	"github.com/meoomura/fullcycle/microservico/wallet/pkg/uow"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	//db, err := sql.Open("mysql", "root:root@tcp(localhost:3306)/wallet?charset=utf8mb4&parseTime=True&loc=Local")
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "mysql", "3306", "wallet"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	configMap := ckafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "wallet",
	}
	kafkaProducer := kafka.NewKafkaProducer(&configMap)

	eventDispatcher := events.NewEventDispatcher()
	eventDispatcher.Register("TransactionCreated", handler.NewTransactionCreatedKafkaHandler(kafkaProducer))
	eventDispatcher.Register("BalanceUpdated", handler.NewUpdatedBalanceKafkaHandler(kafkaProducer))
	transactionCreatedEvent := event.NewTransactionCreated()
	balanceUpdatedEvent := event.NewBalanceUpdated()

	clientDb := database.NewClientDB(db)
	accountDb := database.NewAccountDB(db)

	ctx := context.Background()
	uow := uow.NewUow(ctx, db)

	uow.Register("AccountDB", func(tx *sql.Tx) interface{} {
		return database.NewAccountDB(db)
	})

	uow.Register("TransactionDB", func(tx *sql.Tx) interface{} {
		return database.NewTransactionDB(db)
	})

	createClientUseCase := create_client.NewCreateClientUseCase(clientDb)
	createAccountUseCase := create_account.NewCreateAccountUseCase(accountDb, clientDb)
	createTransactonUseCase := create_transaction.NewCreateTransactionUseCase(uow, eventDispatcher, transactionCreatedEvent, balanceUpdatedEvent)

	webserver := webserver.NewWebServer(":8080")

	clientHandler := web.NewWebClientHandler(*createClientUseCase)
	accountHandler := web.NewWebAccountHandler(*createAccountUseCase)
	transactionHandler := web.NewWebTransactionHandler(*createTransactonUseCase)

	webserver.AddHandler("/clients", clientHandler.CreateClient)
	webserver.AddHandler("/accounts", accountHandler.CreateAccount)
	webserver.AddHandler("/transactions", transactionHandler.CreateTransaction)
	webserver.Start()
}
