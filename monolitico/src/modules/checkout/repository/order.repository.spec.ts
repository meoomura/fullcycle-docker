import { Sequelize } from "sequelize-typescript"
import ClientModel from "./client.model"
import Client from "../domain/client.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import OrderProductModel from "./order.product.model"
import ProductModel from "./product.model"
import OrderModel from "./order.model"
import OrderRepository from "./order.repository"
import Order from "../domain/order.entity"
import Product from "../domain/product.entity"


const clientProps = {
  id: new Id('1'),
  name: 'Client',
  email: 'client@123.com',
  address: "address"
};

const productProps1 = {
  id: new Id('1'),
  name: 'Product 1',
  description: 'Product 1 description',
  salesPrice: 100
};

const productProps2 = {
  id: new Id('2'),
  name: 'Product 2',
  description: 'Product 2 description',
  salesPrice: 200
};


describe("Product Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([ClientModel, ProductModel, OrderModel, OrderProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a order", async () => {

    const client = await ClientModel.create({
      id: clientProps.id.id,
      name: clientProps.name,
      email: clientProps.email,
      address: clientProps.address,
    })

    const product1 = await ProductModel.create({
      id: productProps1.id.id,
      name: productProps1.name,
      description: productProps1.description,
      salesPrice: productProps1.salesPrice
    });

    const product2 = await ProductModel.create({
      id: productProps2.id.id,
      name: productProps2.name,
      description: productProps2.description,
      salesPrice: productProps2.salesPrice
    });

    const repository = new OrderRepository();

    const order = new Order({
      id: new Id("1"),
      client: new Client(clientProps),
      products: [new Product(productProps1), new Product(productProps2)],

    })

    await repository.addOrder(order);

    const orderDb = await OrderModel.findOne({
      where: { id: "1" },
      include: ["client", "products"],
    });

    expect(orderDb.id).toEqual(order.id.id);
    expect(orderDb.status).toEqual("pending");
    expect(orderDb.client.id).toEqual(clientProps.id.id);
    expect(orderDb.client.name).toEqual(clientProps.name);
    expect(orderDb.client.email).toEqual(clientProps.email);
    expect(orderDb.client.address).toEqual(clientProps.address);
    expect(orderDb.products.length).toEqual(2);
    expect(orderDb.products[0].id).toEqual(productProps1.id.id);
    expect(orderDb.products[0].name).toEqual(productProps1.name);
    expect(orderDb.products[0].description).toEqual(productProps1.description);
    expect(orderDb.products[0].salesPrice).toEqual(productProps1.salesPrice);
  })

  it("should find a order", async () => {

    const client = await ClientModel.create({
      id: clientProps.id.id,
      name: clientProps.name,
      email: clientProps.email,
      address: clientProps.address,
    })

    const product1 = await ProductModel.create({
      id: productProps1.id.id,
      name: productProps1.name,
      description: productProps1.description,
      salesPrice: productProps1.salesPrice
    });

    const product2 = await ProductModel.create({
      id: productProps2.id.id,
      name: productProps2.name,
      description: productProps2.description,
      salesPrice: productProps2.salesPrice
    });

    //create order
    const order = await OrderModel.create({
      id: "1",
      client_id: client.id,
      status: "pending"
    });

    const productsIds = [product1.id, product2.id];

    const products = await ProductModel.findAll({
      where: {
        id: productsIds,
      },
    });

    //associate the products with the order
    await order.$add('products', products)


    const repository = new OrderRepository();

    const response = await repository.findOrder(order.id)

    expect(response.id.id).toEqual(order.id);
    expect(response.status).toEqual("pending");
    expect(response.client.id.id).toEqual(clientProps.id.id);
    expect(response.client.name).toEqual(clientProps.name);
    expect(response.client.email).toEqual(clientProps.email);
    expect(response.client.address).toEqual(clientProps.address);
    expect(response.products.length).toEqual(2);
    expect(response.products[0].id.id).toEqual(productProps1.id.id);
    expect(response.products[0].name).toEqual(productProps1.name);
    expect(response.products[0].description).toEqual(productProps1.description);
    expect(response.products[0].salesPrice).toEqual(productProps1.salesPrice);

  })
})