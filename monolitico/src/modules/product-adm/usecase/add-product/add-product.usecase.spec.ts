import Product from "../../domain/product.entity";
import AddProductUseCase from "./add-product.usecase";

describe("Add Product usecase unit test", () => {
    const MockRepository = () => {
        return{
            add: jest.fn(),
            find: jest.fn(),
        };
    };

    it("should add a product",async () => {
        const productRepository =  MockRepository();
        const usecase = new AddProductUseCase(productRepository);

        const input = {
            name: "Product 1",
            description: "Product 1 descript",
            purchasePrice: 100,
            stock: 10,
        }

        const result = await usecase.execute(input);

        expect(productRepository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined;
        expect(result.name).toBe(input.name);
        expect(result.description).toBe(input.description);
        expect(result.purchasePrice).toBe(input.purchasePrice);
        expect(result.stock).toBe(input.stock);
    });

    
});