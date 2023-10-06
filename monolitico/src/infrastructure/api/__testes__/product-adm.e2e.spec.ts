import { Sequelize } from "sequelize-typescript";
import { app } from "../express";
import request from "supertest";
import { Umzug } from "umzug";
import ProductModel from "../../../modules/product-adm/repository/product.model";
import ProductAdmModel from "../../../modules/product-adm/repository/product.model";

import { migrator } from "../../config-migrations/migrator";

describe("E2E test for product", () => {

  let sequelize: Sequelize
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    sequelize.addModels([ProductModel,ProductAdmModel])
    migration = migrator(sequelize)
    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })
    it("should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Product 1",
                description: "Product 1 description",
                purchasePrice: 100,
                stock: 10
            });

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe("Product 1");
        expect(response.body.description).toBe("Product 1 description");
        expect(response.body.purchasePrice).toBe(100);
        expect(response.body.stock).toBe(10);
    });

});