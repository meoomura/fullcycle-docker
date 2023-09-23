import Notification from "../../@shared/notification/notification";
import NotificationError from "../../@shared/notification/notification.error";
import AddressValidatorFactory from "../factory/address.validator.factory";

export default class Address {

    private _street: string = "";
    private _number: number = 0;
    private _zip: string = "";
    private _city: string ="";
    private _state: string ="";
    public _notification: Notification;

    constructor (street: string, number: number, zip: string, city: string, state: string){
        this._street = street;
        this._number = number;
        this._zip = zip;
        this._city = city;
        this._state = state;
        this._notification=new Notification()
        this.validate();
    }

    get street(): string{
        return this._street;
    }

    get number(): number{
        return this._number;
    }

    get zip(): string{
        return this._zip;
    }
    
    get city(): string{
        return this._city;
    }
    
    get state(): string{
        return this._state;
    }
    
    get notification():Notification{
        return this._notification
    }

    validate(): boolean{
        AddressValidatorFactory.create().validate(this);

        if(this.notification.hasErrors()){
            throw new NotificationError(this.notification.getErrors());
        }
        
        return true;
    }

    toString(){
        return `${this._street}, ${this._number} ${this._zip} ${this._city}/${this._state}`;
    }
}
