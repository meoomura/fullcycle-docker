import { Sequelize } from "sequelize-typescript";
import { app } from "../express";
import request from "supertest";
import { Umzug } from "umzug";

import { migrator } from "../../config-migrations/migrator";
import ClientModel from "../../../modules/client-adm/repository/client.model";

describe("E2E test for client", () => {

  let sequelize: Sequelize
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })

    sequelize.addModels([ClientModel])
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
  it("should create a client", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        name: "Cliente 1",
        email: "cliente1@xpto.com",
        document: "1234-5678",
        address: {
          street: "Rua 123",
          number: "99",
          complement: "Casa Verde",
          city: "Criciúma",
          state: "SC",
          zipCode: "88888-888",
        }
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined;
    expect(response.body.name).toBe("Cliente 1")
    expect(response.body.email).toBe("cliente1@xpto.com")
    expect(response.body.document).toBe("1234-5678")
    expect(response.body.address.street).toBe("Rua 123")
  });

});