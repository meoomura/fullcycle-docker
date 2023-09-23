import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
    
    it("should throw error when id is empty", () => {
        expect( () => {
            let customer = new Customer("", "John");
        }).toThrowError(new Error("customer: Id is required"));
    });

    it("should throw error when name is empty", () => {
        expect( () => {
            let customer = new Customer("123", "");
        }).toThrowError(new Error("customer: Name is required"));
    });

    it("should throw error when name and id are empty", () => {
        expect( () => {
            let customer = new Customer("", "");
        }).toThrowError(new Error("customer: Id is required,customer: Name is required"));
    });

    it("should create a customer", () => {
        //Arrange
        const customer = new Customer("123", "John");

        //Assert
        expect( customer.id ).toBe("123");
        expect( customer.name ).toBe("John");
    });


    it("should change name", () => {
        //Arrange
        const customer = new Customer("123", "John");

        //Act
        customer.changeName("Jane");

        //Assert
        expect( customer.name ).toBe("Jane");
    });

    it("should throw error when change name to empty", () => {
        const customer = new Customer("123", "John");

        expect( () => {
            customer.changeName("");
        }).toThrowError(new Error("customer: Name is required"));
    });

    it("should activate a customer", () => {
        const customer = new Customer("123", "John");
        const address =  new Address("Rua sem nome", 10, "12345-678", "São Paulo", "SP");
        customer.changeAddress(address);

        customer.activate();

        expect(customer.isActive()).toBe(true);

    });

    it("should deactivate a customer", () => {
        const customer = new Customer("123", "John");
  
        const address =  new Address("Rua sem nome", 10, "12345-678", "São Paulo", "SP");
        customer.changeAddress(address);

        customer.activate();

        expect(customer.isActive()).toBe(true);
 
        customer.deactivate();

        expect(customer.isActive()).toBe(false);

    });

    it("should throw error when activate a customer without address", () => {
        const customer = new Customer("123", "John");
   
        expect( () => {
            customer.activate();
        }).toThrowError(new Error("Address is mandatory to activate a customer"));
        
    });

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1")
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(15);
        expect(customer.rewardPoints).toBe(25);
    });

    it("should change a address", () => {
        const customer = new Customer("123", "John");
  
        const address =  new Address("Rua sem nome", 10, "12345-678", "São Paulo", "SP");
        customer.changeAddress(address);

        expect(customer.address.street).toBe("Rua sem nome");
        expect(customer.address.number).toBe(10);
        expect(customer.address.zip).toBe("12345-678");
        expect(customer.address.city).toBe("São Paulo");
        expect(customer.address.state).toBe("SP");

        const address2 =  new Address("Rua 1", 20, "98765-432", "Natal", "RN");
        customer.changeAddress(address2);

        expect(customer.address.street).toBe("Rua 1");
        expect(customer.address.number).toBe(20);
        expect(customer.address.zip).toBe("98765-432");
        expect(customer.address.city).toBe("Natal");
        expect(customer.address.state).toBe("RN");

    });

});