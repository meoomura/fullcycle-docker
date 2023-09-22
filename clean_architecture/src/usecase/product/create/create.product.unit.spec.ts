import CreateProductUsecase from "./create.product.usecase";

const input = {
    type: "a",
    name: "Product 1",
    price: 10
}

const MockRepository = ()=>{
    return{
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}
describe("Create product usecase unit test", () => {
    

    it("should create a product", async () => {

        const productRepository = MockRepository();
        const usecase = new CreateProductUsecase(productRepository);

        const output = {
            id: expect.any(String),
            name: input.name,
            price: input.price,
        }

        const result = await usecase.execute(input);

        expect(result).toEqual(output);

    });

    it("should throw error when a product name is empty", async () => {

        const productRepository = MockRepository();
        const usecase = new CreateProductUsecase(productRepository);

        input.name = ""

        await expect(usecase.execute(input)).rejects.toThrow(
            "Name is required"
        );

    });
})

