package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	_ "github.com/go-sql-driver/mysql"
	"github.com/meoomura/fullcycle/microservico/balancems/internal/database"
	"github.com/meoomura/fullcycle/microservico/balancems/internal/kafka"
	"github.com/meoomura/fullcycle/microservico/balancems/internal/usecase/get_account"
	"github.com/meoomura/fullcycle/microservico/balancems/internal/web"
)

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "balancedb", "3306", "balance"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	accountDb := database.NewAccountDB(db)

	configMap := ckafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "wallet",
	}

	kafkaProcessor := kafka.NewKafkaProcessor(&configMap, accountDb)
	kafkaProcessor.Consume()

	getAccountUseCase := get_account.NewGetAccountOutputDTO(accountDb)

	accountHandler := web.NewWebAccountHandler(*getAccountUseCase)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Get("/balances/{id}", accountHandler.GetAccount)

	fmt.Println("App is running on port :3003")
	log.Fatal(http.ListenAndServe(":3003", r))
}
