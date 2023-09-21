import CreateCustomerUsecase from "./create.customer.usecase";

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

const MockRepository = ()=>{
    return{
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}
describe("Create customer usecase unit test", () => {
    

    it("should create a customer", async () => {

        const customerRepository = MockRepository();
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

        const customerRepository = MockRepository();
        const usecase = new CreateCustomerUsecase(customerRepository);

        input.name = ""

        await expect(usecase.execute(input)).rejects.toThrow(
            "Name is required"
        );

    });
})

