import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua A", 12, "01234-567", "São Paulo", "SP");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order ("1","1",[orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ["items"],
         });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "1",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "1",
                    product_id: "1"
                }
            ],
            

        });
    });

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua A", 12, "01234-567", "São Paulo", "SP");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order ("1","1",[orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ["items"],
         });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "1",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "1",
                    product_id: product.id
                }
            ],
            

        });

        const product2 = new Product("2", "Product 2", 20);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 4);

        order.changeItens([orderItem2]);

        await orderRepository.update(order);

        const orderModel2 = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ["items"],
         });

        expect(orderModel2.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "1",
            total: order.total(),
            items: [
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id: "1",
                    product_id: product2.id
                }
            ],
        });
    });

    it("should found a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua A", 12, "01234-567", "São Paulo", "SP");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order ("1","1",[orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ["items"],
         });

        const foundOrderModel = await orderRepository.find("1");

        expect(orderModel.toJSON()).toStrictEqual({
            id: foundOrderModel.id,
            customer_id: foundOrderModel.customerId,
            total: foundOrderModel.total(),
            items: [
                {
                    id: foundOrderModel.items[0].id,
                    name: foundOrderModel.items[0].name,
                    price: foundOrderModel.items[0].price,
                    quantity: foundOrderModel.items[0].quantity,
                    order_id: foundOrderModel.id,
                    product_id: foundOrderModel.items[0].productId,
                }
            ],
            

        });
    });

    it("should throw an erro when order is not found", async () =>{
        const orderRepository = new OrderRepository();
        
        expect(async () => {
            await orderRepository.find("ASDFC");
        }).rejects.toThrow("Order not found");
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua A", 12, "01234-567", "São Paulo", "SP");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order ("1","1",[orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const product2 = new Product("2", "Product 2", 20);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 4);

        const order2 = new Order ("2","1",[orderItem2]);

        await orderRepository.create(order2);
        
        const foundOrders = await orderRepository.findAll();
        const orders = [order,order2]

        expect(orders).toEqual(foundOrders);
    });


});