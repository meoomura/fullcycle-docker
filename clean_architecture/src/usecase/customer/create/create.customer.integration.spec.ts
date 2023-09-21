import CreateCustomerUsecase from "./create.customer.usecase";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";

const input = {
    name: "Customer 1",
    address: {
        street: "Street",
        number: 1,
        zip: "12345-678",
        city: "City",
        state: "SP",
    }
}

describe("Create customer usecase integration test", () => {
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
    })
    it("should create a customer", async () => {

        const customerRepository = new CustomerRepository();
        const usecase = new CreateCustomerUsecase(customerRepository);

        const output = {
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                number: input.address.number,
                zip: input.address.zip,
                city: input.address.city,
                state: input.address.state,
            }
        }

        const result = await usecase.execute(input);

        expect(result).toEqual(output);

    });

    it("should throw error when a customer name is empty", async () => {

        const customerRepository = new CustomerRepository();
        const usecase = new CreateCustomerUsecase(customerRepository);

        input.name = ""

        await expect(usecase.execute(input)).rejects.toThrow(
            "Name is required"
        );

    });
})

