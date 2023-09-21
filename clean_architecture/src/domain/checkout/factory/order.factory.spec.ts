import { v4 as uuid } from "uuid";
import OrderFactory from "./order.factory";

describe("order factory unit test", () => {

    it("should be create an order", () => {
        const orderProps = {
            customerId: uuid(),
            items:[
                {
                    name: "Product 1",
                    productId: uuid(),
                    quantity: 1,
                    price: 100,
                },
            ],
        };

        const order = OrderFactory.create(orderProps);

        expect(order.id).toBeDefined;
        expect(order.customerId).toBe(orderProps.customerId);
        expect(order.items.length).toBe(1);
    });
});