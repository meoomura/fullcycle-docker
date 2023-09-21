import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import FindCustomerUsecase from "./find.customer.usecase";

describe("Find customer usecase integration test", () => {
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

    it("should find a customer", async () => {

        const customerRepository = new CustomerRepository();
        const usecase = new FindCustomerUsecase(customerRepository);

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street", 1, "12345-678", "City", "SP");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const input = {
            id: "123"
        }

        const output = {
            id: "123",
            name: "Customer 1",
            address: {
                street: "Street",
                number: 1,
                zip: "12345-678",
                city: "City",
                state: "SP",
            }
        }

        const result = await usecase.execute(input);

        expect(result).toEqual(output);

    });
})

