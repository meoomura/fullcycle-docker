import { Sequelize } from "sequelize-typescript"
import CustomerFactory from "../../../domain/customer/factory/customer.factory"
import Address from "../../../domain/customer/value-object/address"
import UpdateCustomerUsecase from "./update.customer.usecase"
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model"
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository"
import Customer from "../../../domain/customer/entity/customer"

describe("Update customer usecase integration test", () => {
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


    it("should update a customer", async () => {

        const customerRepository = new CustomerRepository();
        const usecase = new UpdateCustomerUsecase(customerRepository);

        const customer = CustomerFactory.createWithAddress(
            "John",
            new Address("Street", 123,"Zip", "City", "State")
        )

        await customerRepository.create(customer as Customer);

        const input = {
            id: customer.id,
            name: "Jhon Updated",
            address: {
                street: "Street Updated",
                number: 321,
                zip: "Zip Updated",
                city: "City Updated",
                state: "State Updated",
            }
        }
        
        const output = await usecase.execute(input);

        expect(output).toEqual(input);

    });

    it("should throw error when a customer name is empty", async () => {

        const customerRepository = new CustomerRepository;
        const usecase = new UpdateCustomerUsecase(customerRepository);

        const customer = CustomerFactory.createWithAddress(
            "John",
            new Address("Street", 123,"Zip", "City", "State")
        )

        await customerRepository.create(customer as Customer);

        const input = {
            id: customer.id,
            name: "",
            address: {
                street: "Street Updated",
                number: 321,
                zip: "Zip Updated",
                city: "City Updated",
                state: "State Updated",
            }
        }
        
        await expect(usecase.execute(input)).rejects.toThrow(
            "Name is required"
        );

    });
})

