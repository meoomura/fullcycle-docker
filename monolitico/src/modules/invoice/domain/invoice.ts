import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "./invoice-items";

type InvoiceProps = {
    id?: Id;
    name: string;
    document: string;
    address: Address; // value object
    items: InvoiceItems[]; // Invoice Items entity
    createdAt?: Date; // criada automaticamente
    updatedAt?: Date; // criada automaticamente
}

export default class Invoice extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _document: string;
    private _address: Address;
    private _items: InvoiceItems[];

    constructor(input: InvoiceProps) {
        super(input.id, input.createdAt, input.updatedAt);
        this._name = input.name;
        this._document = input.document;
        this._address = input.address;
        this._items = input.items;
    };

    get name(): string {
        return this._name;
    };

    get document(): string {
        return this._document;
    };

    get address(): Address {
        return this._address;
    };

    get items(): InvoiceItems[] {
        return this._items;
    };

    changeAddress(address: Address) {
        this._address = address;
    }

    validate() {
        if(this._name.length === 0){
            throw new Error("Name is required");   
        }
        if(this._document .length === 0){
            throw new Error("Document is required");   
        }
        if(this._address === undefined){
            throw new Error("Address is required")
        }
        if (this._items.length === 0) {
            throw new Error("Items quantity must be greater than 0");
        }
    }
}