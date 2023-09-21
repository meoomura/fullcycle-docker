import Order from "../entity/order";
import OrderInterface from "../entity/order.interface";
import OrderItem from "../entity/order_item";
import {v4 as uuid} from "uuid";

interface OrderFactoryProps{
    customerId: string;
    items: {
        name: string,
        productId: string,
        quantity: number,
        price:number,
    }[];
}

export default class OrderFactory{
    public static create(props: OrderFactoryProps): OrderInterface{
        const items = props.items.map((item) => {
            return new OrderItem(uuid(), item.name, item.price, item.productId,item.quantity);
        });
        return new Order(uuid(),props.customerId,items);
    }
}