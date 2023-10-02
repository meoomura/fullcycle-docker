import Id from "../../@shared/domain/value-object/id.value-object";
import { v4 as uuidv4 } from "uuid";

export default class InvoiceItems {

    private _id: Id;
    private _name: string;
    private _price: number;

    constructor(id: string, name: string, price: number) {
        this._id = new Id(id);
        this._name = name;
        this._price = price;
        this.validate();
    };

    get id(): Id {
        return this._id;
    };

    get name(): string {
        return this._name;
    };

    get price(): number {
        return this._price;
    };

    validate() {
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
        if (this._price < 0) {
            throw new Error("Price must be greater than 0");
        }
    };
}
