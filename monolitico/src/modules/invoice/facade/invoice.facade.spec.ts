import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice-items";
import InvoiceFacade from "./invoice.facade";

describe("InvoiceFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a invoice", async () => {

        const invoiceFacade = InvoiceFacadeFactory.create()

        const input = {
            name: "Invoice 1",
            document: "Document 1",
            street: "Street",
            number: "1",
            complement: "Complement 1",
            city: "City",
            state: "State",
            zipCode: "zipCode",
            items: [{
                id: "1",
                name: "Item 1",
                price: 10
            },
            {
                id: "2",
                name: "Item 2",
                price: 20
            }],

        }

        const result = await invoiceFacade.generate(input);

        const invoice = await InvoiceModel.findOne({
            where: { id: result.id },
            include: ["items"],
        });
        expect(invoice).toBeDefined();
        expect(invoice.id).toBe(result.id);
        expect(invoice.name).toBe(input.name);
        expect(invoice.document).toBe(input.document);
        expect(invoice.street).toBe(input.street);
        expect(invoice.number).toBe(input.number);
        expect(invoice.complement).toBe(input.complement);
        expect(invoice.city).toBe(input.city);
        expect(invoice.state).toBe(input.state);
        expect(invoice.zipCode).toBe(input.zipCode);
        expect(invoice.items[0].id).toEqual(input.items[0].id);
        expect(invoice.items[0].name).toEqual(input.items[0].name);
        expect(invoice.items[0].price).toEqual(input.items[0].price);
        expect(invoice.items[1].id).toEqual(input.items[1].id);
        expect(invoice.items[1].name).toEqual(input.items[1].name);
        expect(invoice.items[1].price).toEqual(input.items[1].price);
        expect(invoice.createdAt).toBeDefined;
        expect(invoice.updatedAt).toBeDefined;
    })

    it("should find a invoice", async () => {
        const invoiceFacade = InvoiceFacadeFactory.create()

        const input = {
            name: "Invoice 1",
            document: "Document 1",
            street: "Street",
            number: "1",
            complement: "Complement 1",
            city: "City",
            state: "State",
            zipCode: "zipCode",
            items: [{
                id: "1",
                name: "Item 1",
                price: 10
            },
            {
                id: "2",
                name: "Item 2",
                price: 20
            }],

        }

        const invoice = await invoiceFacade.generate(input);

        const result = await invoiceFacade.find({ id: invoice.id });

        expect(result.id).toBe(invoice.id);
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.address.street).toBe(input.street);
        expect(result.address.number).toBe(input.number);
        expect(result.address.complement).toBe(input.complement);
        expect(result.address.city).toBe(input.city);
        expect(result.address.state).toBe(input.state);
        expect(result.address.zipCode).toBe(input.zipCode);
        expect(result.items[0].id).toEqual(input.items[0].id);
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
        expect(result.items[1].id).toEqual(input.items[1].id);
        expect(result.items[1].name).toEqual(input.items[1].name);
        expect(result.items[1].price).toEqual(input.items[1].price);
        expect(result.createdAt).toBeDefined;
        expect(result.updatedAt).toBeDefined;
    })
});