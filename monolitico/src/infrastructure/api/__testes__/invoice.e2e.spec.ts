import { Sequelize } from "sequelize-typescript";
import { app } from "../express";
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../../config-migrations/migrator";

import ProductAdmModel from "../../../modules/product-adm/repository/product.model";
import ClientModel from "../../../modules/client-adm/repository/client.model";
import InvoiceItemModel from "../../../modules/invoice/repository/invoice-item.model";
import InvoiceModel from "../../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import ProductModel from "../../../modules/store-catalog/repository/product.model";
import OrderModel from "../../../modules/checkout/repository/order.model";
import OrderProductModel from "../../../modules/checkout/repository/order.product.model";
import ClientCheckoutModel from "../../../modules/checkout/repository/client.model";
import ProductCheckoutModel from "../../../modules/checkout/repository/product.model";

describe("E2E test for Invoice", () => {

  let sequelize: Sequelize
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })

    sequelize.addModels(
      [
        OrderModel,
        ClientModel,
        ProductModel,
        OrderProductModel,
        ProductAdmModel,
        ClientCheckoutModel,
        ProductCheckoutModel,
        InvoiceItemModel,
        InvoiceModel,
        TransactionModel,
      ]); migration = migrator(sequelize)
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
  it("should get invoice", async () => {
    //criar cliente
    const resp_cli = await request(app)
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

    expect(resp_cli.status).toBe(200);
    expect(resp_cli.body.id).toBeDefined();

    //criar produtos
    const resp_prod1 = await request(app)
      .post("/products")
      .send({
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10
      });


    expect(resp_prod1.status).toBe(200);
    expect(resp_prod1.body.id).toBeDefined();

    const resp_prod2 = await request(app)
      .post("/products")
      .send({
        name: "Product 2",
        description: "Product 2 description",
        purchasePrice: 120,
        stock: 10
      });

    expect(resp_prod2.status).toBe(200);
    expect(resp_prod2.body.id).toBeDefined();

    //atualizei o salesPrice direto na tabela pois não tem método implementado para alterar esse valor.
    await ProductModel.update(
      { salesPrice: 110 },
      { where: { id: resp_prod1.body.id } }
    );

    await ProductModel.update(
      { salesPrice: 210 },
      { where: { id: resp_prod2.body.id } }
    );

    //checkout
    const checkout = await request(app)
      .post("/checkout")
      .send({
        clientId: resp_cli.body.id,
        products: [{ productId: resp_prod1.body.id }, { productId: resp_prod2.body.id }],
      });

    expect(checkout.status).toBe(200);
    expect(checkout.body.id).toBeDefined();
    expect(checkout.body.invoiceId).toBeDefined();
    expect(checkout.body.status).toBe("approved");
    expect(checkout.body.total).toBe(320);

    //get invoice
    const invoice = await request(app)
      .get(`/invoice/${checkout.body.invoiceId}`)
      .send();

    expect(invoice.status).toBe(200);
    expect(invoice.body.id).toBeDefined();
    expect(invoice.body.name).toBe(resp_cli.body.name);
    expect(invoice.body.document).toBe(resp_cli.body.document);
    expect(invoice.body.items.length).toBe(2);
    expect(invoice.body.total).toBe(checkout.body.total);


  });

});