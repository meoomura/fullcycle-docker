import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit test", () =>{

    it("should create a customer", () => {

        const customer = CustomerFactory.create("Customer");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Customer");
        expect(customer.address).toBeUndefined;
    });

    it("should create a customer with address", () => {

        const address =  new Address("Rua sem nome", 10, "12345-678", "São Paulo", "SP");
        const customer = CustomerFactory.createWithAddress("Customer",address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Customer");
        expect(customer.address).toBe(address);
    });

});


       