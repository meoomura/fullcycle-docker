import Customer from "../entity/customer";
import {v4 as uuid} from "uuid"
import Address from "../value-object/address";
import CustomerInterface from "../entity/customer.interface";

export default class CustomerFactory{
    
    public static create(name: string): Customer {
        return new Customer(uuid(), name);
    }

    public static createWithAddress(name: string, address: Address): CustomerInterface{
        const customer = new Customer(uuid(), name);
        customer.changeAddress(address);
        return customer;
    }


}