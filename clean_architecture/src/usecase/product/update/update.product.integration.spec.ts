import { Sequelize } from "sequelize-typescript"
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUsecase from "./update.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";
import Product from "../../../domain/product/entity/product";

describe("Update product usecase integration test", () => {
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


    it("should update a product", async () => {

        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUsecase(productRepository);

        const product = ProductFactory.create("a", "Product",10);
    
        await productRepository.create(product as Product);

        const input = {
            id: product.id,
            name: "Product Updated",
            price: 20
        }
        
        const output = await usecase.execute(input);

        expect(output).toEqual(input);

    });

    it("should throw error when a product name is empty", async () => {

        const productRepository = new ProductRepository;
        const usecase = new UpdateProductUsecase(productRepository);

        const product = ProductFactory.create("a", "Product",10);
    
        await productRepository.create(product as Product);

        const input = {
            id: product.id,
            name: "",
            price: 20
        }
        
        await expect(usecase.execute(input)).rejects.toThrow(
            "Name is required"
        );

    });
})

