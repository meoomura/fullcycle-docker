import CustomerFactory from "../../../domain/customer/factory/customer.factory"
import Address from "../../../domain/customer/value-object/address"
import UpdateCustomerUsecase from "./update.customer.usecase"

const customer = CustomerFactory.createWithAddress(
    "John",
    new Address("Street", 123,"Zip", "City", "State")
)

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

const MockRepository = ()=>{
    return{
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn() ,
    }
}
describe("Update customer usecase unit test", () => {
    

    it("should update a customer", async () => {

        const customerRepository = MockRepository();
        const usecase = new UpdateCustomerUsecase(customerRepository);

        const output = await usecase.execute(input);

        expect(output).toEqual(input);

    });

    it("should throw error when a customer name is empty", async () => {

        const customerRepository = MockRepository();
        const usecase = new UpdateCustomerUsecase(customerRepository);

        input.name = ""

        await expect(usecase.execute(input)).rejects.toThrow(
            "Name is required"
        );

    });
})

