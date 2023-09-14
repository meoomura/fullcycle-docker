import { Sequelize } from "sequelize-typescript";
import CustomerModel from "./customer.model";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import CustomerRepository from "./customer.repository";

describe("Customer repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Jhon");
        const address = new Address("Rua A", 12, "01234-567","São Paulo", "SP");
        customer.changeAddress(address);
        
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({where: {id: "1"}});

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
            state: address.state
            
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Jhon");
        const address = new Address("Rua A", 12, "01234-567","São Paulo", "SP");
        customer.changeAddress(address);
        
        await customerRepository.create(customer);
 
        const customerModel = await CustomerModel.findOne({where: {id: "1"}});

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address.street,
            number: address.number,
            zipcode: address.zip,
            city: address.city,
            state: address.state
            
        });

        customer.changeName("Peter");
        const address2 = new Address("Rua B", 99, "05682-567","Salvador", "BA");
        customer.changeAddress(address2);
        customer.activate();

        await customerRepository.update(customer);

        const customerModel2 = await CustomerModel.findOne({where: {id: "1"}});

        expect(customerModel2.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: address2.street,
            number: address2.number,
            zipcode: address2.zip,
            city: address2.city,
            state: address2.state
        });
    });

    it("should found a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Jhon");
        const address = new Address("Rua A", 12, "01234-567","São Paulo", "SP");
        customer.changeAddress(address);
        customer.activate();
        
        await customerRepository.create(customer);
 
        const customerModel = await CustomerModel.findOne({where: {id: "1"}});

        const foundCustomerModel = await customerRepository.find("1");

        expect(customerModel.toJSON()).toStrictEqual({
            id: foundCustomerModel.id,
            name: foundCustomerModel.name,
            active: foundCustomerModel.isActive(),
            rewardPoints: foundCustomerModel.rewardPoints,
            street: foundCustomerModel.address.street,
            number: foundCustomerModel.address.number,
            zipcode: foundCustomerModel.address.zip,
            city: foundCustomerModel.address.city,
            state: foundCustomerModel.address.state
        });
    });

    it("should throw an erro when customer is not found", async () =>{
        const customerRepository = new CustomerRepository();
        
        expect(async () => {
            await customerRepository.find("ASDFC");
        }).rejects.toThrow("Customer not found");
    });

    it("should find all customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Jhon");
        const address = new Address("Rua A", 12, "01234-567","São Paulo", "SP");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        
        const customer2 = new Customer("2", "Peter");
        const address2 = new Address("Rua B", 34, "89012-345","Manaus", "AM");
        customer2.changeAddress(address2);
        customer2.activate();
        await customerRepository.create(customer2);

        const foundCustomers = await customerRepository.findAll();
        const customers = [customer,customer2]

        expect(customers).toEqual(foundCustomers);
    });
});