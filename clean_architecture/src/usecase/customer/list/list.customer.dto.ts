export interface InputListCustomerDto{
}

type Customer = {
    id: string;
    name: string;
    address:{
        street: string;
        number: number;
        zip: string;
        city: string;
        state: string;
    }
}
export interface OutputListCustomerDto{
     customers: Customer[];  
}