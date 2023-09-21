import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUsecase from "./find.customer.usecase";

const customer = new Customer("123", "Customer 1");
const address = new Address("Street", 1, "12345-678", "City", "SP");
customer.changeAddress(address);

const MockRepository = ()=>{
    return{
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}
describe("Find customer usecase unit test", () => {
    

    it("should find a customer", async () => {

        const customerRepository = MockRepository();
        const usecase = new FindCustomerUsecase(customerRepository);

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

    it("should not find a customer", async () => {

        const customerRepository = MockRepository();
        customerRepository.find.mockImplementation(()=> {
            throw new Error("Customer not found");
            
        });
        const usecase = new FindCustomerUsecase(customerRepository);

        const input = {
            id: "123"
        }

        expect(()=>{
            return usecase.execute(input);
        }).rejects.toThrow("Customer not found");

    });
})

