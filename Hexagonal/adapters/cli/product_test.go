package cli_test

import (
	"fmt"
	"testing"

	"github.com/golang/mock/gomock"
	"github.com/meoomura/fullcycle-docker/hexagonal/adapters/cli"
	mock_application "github.com/meoomura/fullcycle-docker/hexagonal/application/mocks"
	"github.com/stretchr/testify/require"
)

func TestRun(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	productName := "Product Test"
	productPrice := 1.99
	productStatus := "enabled"
	productId := "abc"

	productMok := mock_application.NewMockProductInterface(ctrl)
	productMok.EXPECT().GetId().Return(productId).AnyTimes()
	productMok.EXPECT().GetName().Return(productName).AnyTimes()
	productMok.EXPECT().GetPrice().Return(productPrice).AnyTimes()
	productMok.EXPECT().GetStatus().Return(productStatus).AnyTimes()

	serviceMock := mock_application.NewMockProductServiceInterface(ctrl)
	serviceMock.EXPECT().Create(productName, productPrice).Return(productMok, nil).AnyTimes()
	serviceMock.EXPECT().Get(productId).Return(productMok, nil).AnyTimes()
	serviceMock.EXPECT().Enable(gomock.Any()).Return(productMok, nil).AnyTimes()
	serviceMock.EXPECT().Disable(gomock.Any()).Return(productMok, nil).AnyTimes()

	resultExpected := fmt.Sprintf("Product Id %s with the name %s has been created with the price %f and status %s",
		productId, productName, productPrice, productStatus)
	result, err := cli.Run(serviceMock, "create", "", productName, productPrice)
	require.Nil(t, err)
	require.Equal(t, resultExpected, result)

	resultExpected = fmt.Sprintf("Product %s has been enabled", productName)
	result, err = cli.Run(serviceMock, "enable", productId, "", 0)
	require.Nil(t, err)
	require.Equal(t, resultExpected, result)

	resultExpected = fmt.Sprintf("Product %s has been disabled", productName)
	result, err = cli.Run(serviceMock, "disable", productId, "", 0)
	require.Nil(t, err)
	require.Equal(t, resultExpected, result)

	resultExpected = fmt.Sprintf("Product Id: %s\nName: %s\nPrice: %f\nStatus: %s",
		productId, productName, productPrice, productStatus)
	result, err = cli.Run(serviceMock, "", productId, "", 0)
	require.Nil(t, err)
	require.Equal(t, resultExpected, result)

}
