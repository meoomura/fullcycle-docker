package application_test

import (
	"testing"

	"github.com/meoomura/fullcycle-docker/hexagonal/application"
	uuid "github.com/satori/uuid"
	"github.com/stretchr/testify/require"
)

func TestProduct_Enable(t *testing.T) {
	product := application.Product{}
	product.Name = "Hello"
	product.Status = application.DISABLED
	product.Price = 10

	err := product.Enable()
	require.Nil(t, err)

	product.Price = 0
	err = product.Enable()
	require.Equal(t, "the price must be greater than zero to enable the product", err.Error())
}

func TestProduct_Disable(t *testing.T) {
	product := application.Product{}
	product.Name = "Hello"
	product.Status = application.ENABLED
	product.Price = 0

	err := product.Disable()
	require.Nil(t, err)

	product.Price = 10
	err = product.Disable()
	require.Equal(t, "the price must be zero in order to have the product disabled", err.Error())
}

func TestProduct_Validate(t *testing.T) {
	product := application.Product{}
	product.Id = uuid.NewV4().String()
	product.Name = "Hello"
	product.Status = application.ENABLED
	product.Price = 10

	_, err := product.IsValid()
	require.Nil(t, err)

	product.Status = "INVALID"
	_, err = product.IsValid()
	require.Equal(t, "the status must be enabled ou disabled", err.Error())

	product.Status = application.ENABLED
	_, err = product.IsValid()
	require.Nil(t, err)

	product.Price = -10
	_, err = product.IsValid()
	require.Equal(t, "the price must be greater or equal zero", err.Error())

	product.Price = 10
	product.Name = ""
	_, err = product.IsValid()
	require.Error(t, err)

}

func TestProduct_Get(t *testing.T) {
	product := application.Product{}
	product.Id = uuid.NewV4().String()
	product.Name = "Hello"
	product.Status = application.DISABLED
	product.Price = 10

	require.Equal(t, product.Id, product.GetId())
	require.Equal(t, product.Name, product.GetName())
	require.Equal(t, product.Status, product.GetStatus())
	require.Equal(t, product.Price, product.GetPrice())
}
