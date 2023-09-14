import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import CustomerCreatedEvent from "./customer-created.event";
import SendMessageWhenCustomerIsCreated1Handler from "./handler/send-message-when-customer-is-created-1.handler";
import SendMessageWhenCustomerIsCreated2Handler from "./handler/send-message-when-customer-is-created-2.handler";

describe("Customer Created events tests", () => {
    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new SendMessageWhenCustomerIsCreated1Handler();
        const eventHandler2 = new SendMessageWhenCustomerIsCreated2Handler();
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
       
        const customer = new Customer("123", "John");

        eventDispatcher.register("CustomerCreatedEvent",eventHandler1);
        
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toBe(eventHandler1);

        eventDispatcher.register("CustomerCreatedEvent",eventHandler2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toBe(eventHandler2);

        const customerCreatedEvent =  new CustomerCreatedEvent(customer);
        
        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

})
