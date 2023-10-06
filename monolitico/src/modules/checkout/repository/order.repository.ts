import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import ClientModel from "./client.model";
import OrderModel from "./order.model";
import OrderProductModel from "./order.product.model";
import ProductModel from "./product.model";

export default class OrderRepository implements CheckoutGateway {

  async addOrder(entity: Order): Promise<void> {
    try {
      //create order
      const order = await OrderModel.create({
        id: entity.id.id,
        client_id: entity.client.id.id,
        status: entity.status,
      });

      const productsIds = entity.products.map((p) =>{
        return p.id.id;
      });

      const products = await ProductModel.findAll({
        where: {
          id: productsIds,
        },
      });

      //associate the products with the order
      await order.$add('products',products)

    } catch (err) {
      throw err;
    }
  }

  async findOrder(id: string): Promise<Order> {

    const order = await OrderModel.findOne({
      where: { id },
      include: ["client", "products"]
    })

    if (!order) {
      return null;
    }
    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.client.id),
        name: order.client.name,
        email: order.client.email,
        address: order.client.address,
      }),
      products: order.products.map((p) => {
        return new Product({
          id: new Id(p.id),
          name: p.name,
          description: p.description,
          salesPrice: p.salesPrice
        });
      }),
      status: order.status,

      
    });
  }
}