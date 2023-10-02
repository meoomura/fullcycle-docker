import Invoice from "../domain/invoice";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice-items";

export default class InvoiceRepository implements InvoiceGateway {
    async generate(invoice: Invoice): Promise<void> {

        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            createdAt: new Date(),
            updatedAt: new Date(),

        },
            {
                include: [{ model: InvoiceItemModel }],
            })
    }
    async find(id: string): Promise<Invoice> {

        let invoice;
        try {
            invoice = await InvoiceModel.findOne({
                where: { id },
                include: ["items"],
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error(`Invoice with id ${id} not found`);
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.city,
                invoice.state,
                invoice.zipCode,
            ),
            items: invoice.items.map((item) => new InvoiceItems(item.id, item.name, item.price)),
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt

        });
    }
}