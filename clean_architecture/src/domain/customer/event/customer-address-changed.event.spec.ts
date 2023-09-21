import Address from "../value-object/address";
import Customer from "../entity/customer";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import SendMessageWhenCustomerAddressIsChangedHandler from "./handler/send-message-when-customer-address-is-changed.handler";
import EventDispatcher from "../../@shared/event/event-dispatcher";

describe("Customer address changed events tests", () => {
    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendMessageWhenCustomerAddressIsChangedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        const customer = new Customer("123", "John");
  
        const address =  new Address("Rua sem nome", 10, "12345-678", "São Paulo", "SP");
        customer.changeAddress(address);

        eventDispatcher.register("CustomerAddressChangedEvent",eventHandler);
        
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toBe(eventHandler);

        const customerAddressChangedEvent =  new CustomerAddressChangedEvent(customer);
        
        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
        
    });

})
