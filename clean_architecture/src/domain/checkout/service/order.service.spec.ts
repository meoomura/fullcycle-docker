import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service unit tests", () => {

    it("should throw error when o items in order", () => {
        
        expect( () => {
            const customer = new Customer("c1", "Customer 1");
            const order = OrderService.placeOrder(customer, []);

        }).toThrowError("Order must have at least one item");
        
    });
      

    it("should place a order", () => {

        const customer = new Customer("c1", "Customer 1");
        const item = new OrderItem("i1", "Item 1", 10, "p1", 1);

        const order = OrderService.placeOrder(customer, [item]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });

    it("should get total of all orders", () => {

        const item1 = new OrderItem("i1", "item 1", 100, "p1", 1);
        const item2 = new OrderItem("i2", "item 2", 200, "p2", 2);
        
        const order = new Order("o1", "c1", [item1]);
        const order2 = new Order("o2", "c1", [item2]);
        
        const total = OrderService.total([order,order2]);
        
        expect(total).toBe(500);
        
    });
});