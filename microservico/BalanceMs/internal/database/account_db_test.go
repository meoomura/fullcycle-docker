package database

import (
	"database/sql"
	"testing"

	_ "github.com/mattn/go-sqlite3"
	"github.com/meoomura/fullcycle/microservico/balancems/internal/entity"
	"github.com/stretchr/testify/suite"
)

type AccountDBTestSuite struct {
	suite.Suite
	db        *sql.DB
	accountDB *AccountDB
}

func (s *AccountDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)
	s.db = db
	db.Exec("Create table accounts (id varchar(255), balance int, updated_at datetime)")
	s.accountDB = NewAccountDB(db)
}

func (s *AccountDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE accounts")
}

func TestAccountDBSuite(t *testing.T) {
	suite.Run(t, new(AccountDBTestSuite))
}

func (s *AccountDBTestSuite) TestSave() {
	account := entity.NewAccount("1", 100)
	err := s.accountDB.Save(account)
	s.Nil(err)
}

func (s *AccountDBTestSuite) TestGet() {
	account := entity.NewAccount("1", 100)
	err := s.accountDB.Save(account)
	s.Nil(err)
	accountDB, err := s.accountDB.Get(account.ID)
	s.Nil(err)
	s.Equal(account.ID, accountDB.ID)
	s.Equal(account.Balance, accountDB.Balance)
}

func (s *AccountDBTestSuite) TestUpdateBalance() {
	account := entity.NewAccount("1", 100)
	err := s.accountDB.Save(account)
	s.Nil(err)
	account.UpdateBalance(200)
	err = s.accountDB.UpdateBalance(account)
	s.Nil(err)
	accountDB, err := s.accountDB.Get(account.ID)
	s.Nil(err)
	s.Equal(account.ID, accountDB.ID)
	s.Equal(200.0, accountDB.Balance)
}
