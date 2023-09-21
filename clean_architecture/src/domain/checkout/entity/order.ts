import OrderItem from "./order_item";

export default class Order{

    private _id: string;
    private _customer_id: string;
    private _items: OrderItem[] = [];
    private _total: number;

    constructor(id: string, customerId: string, items: OrderItem[]){
        this._id = id;
        this._customer_id = customerId;
        this._items = items;
        this._total = this.total();
        this.validate();
    }

    get id(): string{
        return this._id;
    }

    get customerId(): string{
        return this._customer_id;
    }
    
    get items(): OrderItem[]{
        return this._items;
    }
    
    changeItens(items: OrderItem[]){
        this._items = items;
    }

    validate(): boolean{
        if(this._id.length === 0){
            throw new Error("Id is required");     
        }
        if(this._customer_id.length === 0){
            throw new Error("CustomerId is required");     
        }
        if(this._items.length === 0){
            throw new Error("Item qtd must be greater than 0");     
        }
        
        return true;
    }

    total(): number{ 
        return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);

    }
}