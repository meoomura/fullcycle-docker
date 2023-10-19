package events

import (
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
)

type TestEvent struct {
	Name    string
	Payload interface{}
}

func (e *TestEvent) GetName() string {
	return e.Name
}

func (e *TestEvent) GetPayload() interface{} {
	return e.Payload
}

func (e *TestEvent) GetDateTime() time.Time {
	return time.Now()
}

func (e *TestEvent) SetPayload(interface{}) {}

type TestEventHandler struct {
	ID int
}

func (h *TestEventHandler) Handle(event EventInterface, wg *sync.WaitGroup) {}

type EventDispatcherTestSuite struct {
	suite.Suite
	event           TestEvent
	event2          TestEvent
	handler         TestEventHandler
	handler2        TestEventHandler
	handler3        TestEventHandler
	EventDispatcher *EventDispatcher
}

func (suite *EventDispatcherTestSuite) SetupTest() {
	suite.event = TestEvent{Name: "test", Payload: "test"}
	suite.event2 = TestEvent{Name: "test2", Payload: "test2"}
	suite.handler = TestEventHandler{ID: 1}
	suite.handler2 = TestEventHandler{ID: 2}
	suite.handler3 = TestEventHandler{ID: 3}
	suite.EventDispatcher = NewEventDispatcher()
}

func (suite *EventDispatcherTestSuite) TestEventDispatcher_Register() {
	err := suite.EventDispatcher.Register(suite.event.Name, &suite.handler)
	suite.Nil(err)
	suite.Equal(1, len(suite.EventDispatcher.handlers[suite.event.GetName()]))

	err = suite.EventDispatcher.Register(suite.event.Name, &suite.handler2)
	suite.Nil(err)
	suite.Equal(2, len(suite.EventDispatcher.handlers[suite.event.GetName()]))

	assert.Equal(suite.T(), &suite.handler, suite.EventDispatcher.handlers[suite.event.GetName()][0])
	assert.Equal(suite.T(), &suite.handler2, suite.EventDispatcher.handlers[suite.event.GetName()][1])
}

func (suite *EventDispatcherTestSuite) TestEventDispatcher_Register_ErrHandlerAlreadyRegistered() {
	err := suite.EventDispatcher.Register(suite.event.Name, &suite.handler)
	suite.Nil(err)

	err = suite.EventDispatcher.Register(suite.event.Name, &suite.handler)
	suite.Equal(ErrHandlerAlreadyRegistered, err)
	suite.Equal(1, len(suite.EventDispatcher.handlers[suite.event.GetName()]))
}

func (suite *EventDispatcherTestSuite) TestEventDispatcher_Clear() {
	err := suite.EventDispatcher.Register(suite.event.Name, &suite.handler)
	suite.Nil(err)
	suite.Equal(1, len(suite.EventDispatcher.handlers[suite.event.GetName()]))

	err = suite.EventDispatcher.Register(suite.event.Name, &suite.handler2)
	suite.Nil(err)
	suite.Equal(2, len(suite.EventDispatcher.handlers[suite.event.GetName()]))

	err = suite.EventDispatcher.Register(suite.event2.Name, &suite.handler3)
	suite.Nil(err)
	suite.Equal(1, len(suite.EventDispatcher.handlers[suite.event2.GetName()]))

	suite.EventDispatcher.Clear()
	suite.Equal(0, len(suite.EventDispatcher.handlers))

}

func (suite *EventDispatcherTestSuite) TestEventDispatcher_Has() {
	err := suite.EventDispatcher.Register(suite.event.Name, &suite.handler)
	suite.Nil(err)
	err = suite.EventDispatcher.Register(suite.event.Name, &suite.handler2)
	suite.Nil(err)
	err = suite.EventDispatcher.Register(suite.event2.Name, &suite.handler3)
	suite.Nil(err)
	suite.Equal(1, len(suite.EventDispatcher.handlers[suite.event2.GetName()]))

	assert.True(suite.T(), suite.EventDispatcher.Has(suite.event.Name, &suite.handler))
	assert.True(suite.T(), suite.EventDispatcher.Has(suite.event.Name, &suite.handler2))
	assert.True(suite.T(), suite.EventDispatcher.Has(suite.event2.Name, &suite.handler3))
	assert.False(suite.T(), suite.EventDispatcher.Has(suite.event2.Name, &suite.handler))
}

type MockHandler struct {
	mock.Mock
}

func (m *MockHandler) Handle(event EventInterface, wg *sync.WaitGroup) {
	m.Called(event)
	wg.Done()
}

func (suite *EventDispatcherTestSuite) TestEventDispatcher_Dispatch() {
	eh := &MockHandler{}
	eh.On("Handle", &suite.event)

	eh2 := &MockHandler{}
	eh2.On("Handle", &suite.event)

	suite.EventDispatcher.Register(suite.event.GetName(), eh)
	suite.EventDispatcher.Register(suite.event.GetName(), eh2)

	suite.EventDispatcher.Dispatch(&suite.event)
	eh.AssertExpectations(suite.T())
	eh.AssertNumberOfCalls(suite.T(), "Handle", 1)

	eh2.AssertExpectations(suite.T())
	eh2.AssertNumberOfCalls(suite.T(), "Handle", 1)
}

func (suite *EventDispatcherTestSuite) TestEventDispatcher_Remove() {
	err := suite.EventDispatcher.Register(suite.event.Name, &suite.handler)
	suite.Nil(err)
	suite.Equal(1, len(suite.EventDispatcher.handlers[suite.event.GetName()]))

	err = suite.EventDispatcher.Register(suite.event.Name, &suite.handler2)
	suite.Nil(err)
	suite.Equal(2, len(suite.EventDispatcher.handlers[suite.event.GetName()]))

	err = suite.EventDispatcher.Register(suite.event2.Name, &suite.handler3)
	suite.Nil(err)
	suite.Equal(1, len(suite.EventDispatcher.handlers[suite.event2.GetName()]))

	suite.EventDispatcher.Remove(suite.event.Name, &suite.handler)
	suite.Equal(1, len(suite.EventDispatcher.handlers[suite.event.GetName()]))
	assert.Equal(suite.T(), &suite.handler2, suite.EventDispatcher.handlers[suite.event.GetName()][0])

	suite.EventDispatcher.Remove(suite.event.Name, &suite.handler2)
	suite.Equal(0, len(suite.EventDispatcher.handlers[suite.event.GetName()]))

	suite.EventDispatcher.Remove(suite.event2.Name, &suite.handler3)
	suite.Equal(0, len(suite.EventDispatcher.handlers[suite.event2.GetName()]))
}

func TestSuite(t *testing.T) {
	suite.Run(t, new(EventDispatcherTestSuite))
}
