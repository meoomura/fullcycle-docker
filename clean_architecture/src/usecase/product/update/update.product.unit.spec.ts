import Product from "../../../domain/product/entity/product";
import UpdateProductUsecase from "./update.product.usecase";

const product = new Product("123", "Product 1", 10);

const input = {
    id: product.id,
    name: "Jhon Updated",
    price: 20,
}

const MockRepository = ()=>{
    return{
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn() ,
    }
}
describe("Update product usecase unit test", () => {
    

    it("should update a product", async () => {

        const productRepository = MockRepository();
        const usecase = new UpdateProductUsecase(productRepository);

        const output = await usecase.execute(input);

        expect(output).toEqual(input);

    });

    it("should throw error when a product name is empty", async () => {

        const productRepository = MockRepository();
        const usecase = new UpdateProductUsecase(productRepository);

        input.name = ""

        await expect(usecase.execute(input)).rejects.toThrow(
            "Name is required"
        );

    });
})

