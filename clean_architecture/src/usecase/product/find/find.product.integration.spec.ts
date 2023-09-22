import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import FindProductUsecase from "./find.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const product = new Product("123", "Product 1", 10);

const MockRepository = ()=>{
    return{
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}
describe("Find product usecase unit test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });



    it("should find a product", async () => {

        const productRepository = new ProductRepository();
        const usecase = new FindProductUsecase(productRepository);

        await productRepository.create(product);

        const input = {
            id: "123"
        }

        const output = {
            id: "123",
            name: "Product 1",
            price: 10,
        }

        const result = await usecase.execute(input);

        expect(result).toEqual(output);

    });

    it("should not find a product", async () => {

        const productRepository = new ProductRepository;
        const usecase = new FindProductUsecase(productRepository);

        await productRepository.create(product);

        const input = {
            id: "111"
        }

        expect(()=>{
            return usecase.execute(input);
        }).rejects.toThrow("Product not found");

    });
})

