import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUsecase from "./create.product.usecase";

const input = {
    type: "a",
    name: "Product 1",
    price: 10
}


describe("Create product usecase integration test", () => {
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
    })
    it("should create a product", async () => {

        const productRepository = new ProductRepository();
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

        const productRepository = new ProductRepository();
        const usecase = new CreateProductUsecase(productRepository);

        input.name = ""

        await expect(usecase.execute(input)).rejects.toThrow(
            "Name is required"
        );

    });
})

