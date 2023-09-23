import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
    
    it("should throw error when id is empty", () => {
        expect( () => {
            let order = new Order("","123", []);
        }).toThrowError(new Error("Id is required"));
    });

    it("should throw error when customerId is empty", () => {
        expect( () => {
            let order = new Order("123","", []);
        }).toThrowError(new Error("CustomerId is required"));
    });

    it("should throw error when item is empty", () => {
        expect( () => {
            let order = new Order("123","123", []);
        }).toThrowError(new Error("Item qtd must be greater than 0"));
    });

    it("should be calculate total", () => {
        const item = new OrderItem("i1","item 1",100, "p1",2);
        const item2 = new OrderItem("i2","item 2",200, "p2",2);
        const order = new Order("o1", "c1",[item]);
        
        let total = order.total();
        expect(total).toBe(200);

        const order2 = new Order("o2", "c2",[item, item2]);
        
        total = order2.total();
        expect(total).toBe(600);
    });

    it("should throw error if the item qty is less ou equal zero", () => {
        expect(() => {
            const item = new OrderItem("i1","item 1",100, "p1",0);
            const order = new Order("o1", "c1",[item]);
        }).toThrowError(new Error("Quantity must be greater than 0"));
    });
});