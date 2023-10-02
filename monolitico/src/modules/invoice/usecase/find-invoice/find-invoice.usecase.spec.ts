import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice-items";
import FindInvoiceUseCase from "./find-invoice.usecase";


const address = new Address("Street", "1", "Complement 1", "City", "State","zipCode");
const item = new InvoiceItems("1","Item 1",10);
const item2 = new InvoiceItems("2","Item 2",20);

const invoice = new Invoice({
    id: new Id("1"),
    name: "Invoice 1",
    document: "Document 1",
    address: address,
    items:[item,item2],
})


const MockRepository = () => {
    return{
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        generate: jest.fn(),
    };
};

describe("find invoice usecase unit test", () => {
    it("should find a invoice",async () => {
        const invoiceRepository =  MockRepository();
        const useCase = new FindInvoiceUseCase(invoiceRepository);
        
        const input = {
            id:"1",
        }

        const result = await useCase.execute(input);

        expect(invoiceRepository.find).toHaveBeenCalled();
        expect(result.id).toBe("1");
        expect(result.name).toBe("Invoice 1");
        expect(result.document).toBe("Document 1");
        expect(result.address.street).toBe(invoice.address.street);
        expect(result.address.complement).toBe(invoice.address.complement);
        expect(result.address.number).toBe(invoice.address.number);
        expect(result.address.state).toBe(invoice.address.state);
        expect(result.address.city).toBe(invoice.address.city);
        expect(result.address.zipCode).toBe(invoice.address.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toBe(item.id.id);
        expect(result.items[0].name).toBe(item.name);
        expect(result.items[0].price).toBe(item.price);
        expect(result.items[1].id).toBe(item2.id.id);
        expect(result.items[1].name).toBe(item2.name);
        expect(result.items[1].price).toBe(item2.price);
        expect(result.total).toBe(30);
        expect(result.createdAt).toBe(invoice.createdAt);
        expect(result.updatedAt).toBe(invoice.updatedAt);
    })
})