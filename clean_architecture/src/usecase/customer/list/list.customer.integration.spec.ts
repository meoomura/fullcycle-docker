import { Sequelize } from "sequelize-typescript";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUsecase from "./list.customer.usecase";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";

const customer1 = CustomerFactory.createWithAddress(
    "Jhon",
    new Address("Street 1", 1, "zip1", "City 1", "State 1")
);
const customer2 = CustomerFactory.createWithAddress(
    "Dave",
    new Address("Street 2", 2, "zip2", "City 2", "State 2")
);


describe("List customer usecase integration test", () => {
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

    it("should listering customers", async () => {

        const customerRepository = new CustomerRepository();
        const usecase = new ListCustomerUsecase(customerRepository);

        await customerRepository.create(customer1 as Customer);

        await customerRepository.create(customer2 as Customer);

        const output = await usecase.execute({});

        expect(output.customers.length).toBe(2);
        expect(output.customers[0].id).toBe(customer1.id);
        expect(output.customers[0].name).toBe(customer1.name);
        expect(output.customers[0].address.street).toBe(customer1.address.street);
        expect(output.customers[0].address.number).toBe(customer1.address.number);
        expect(output.customers[0].address.zip).toBe(customer1.address.zip);
        expect(output.customers[0].address.city).toBe(customer1.address.city);
        expect(output.customers[0].address.state).toBe(customer1.address.state);
        
        expect(output.customers[1].id).toBe(customer2.id);
        expect(output.customers[1].name).toBe(customer2.name);
        expect(output.customers[1].address.street).toBe(customer2.address.street);
        expect(output.customers[1].address.number).toBe(customer2.address.number);
        expect(output.customers[1].address.zip).toBe(customer2.address.zip);
        expect(output.customers[1].address.city).toBe(customer2.address.city);
        expect(output.customers[1].address.state).toBe(customer2.address.state);

    });

    
})

