import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import InvoiceItems from "../domain/invoice-items";
import Invoice from "../domain/invoice";
import InvoiceRepository from "./invoice.repository";
import Address from "../../@shared/domain/value-object/address";
import exp from "constants";

describe("ProductRepository test", () => {
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
    const invoiceProps = {
      name: "Invoice 1",
      document: "Document 1",
      address: new Address("Street", "1", "Complement 1", "City", "State", "zipCode"),
      items: [new InvoiceItems("1", "Item 1", 10), new InvoiceItems("2", "Item 2", 20)]
    }

    const invoice = new Invoice(invoiceProps);
    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: ["items"],
    });
    expect(invoiceDb.id).toBe(invoice.id.id);
    expect(invoiceDb.name).toBe(invoice.name);
    expect(invoiceDb.document).toBe(invoice.document);
    expect(invoiceDb.street).toBe(invoice.address.street);
    expect(invoiceDb.number).toBe(invoice.address.number);
    expect(invoiceDb.complement).toBe(invoice.address.complement);
    expect(invoiceDb.city).toBe(invoice.address.city);
    expect(invoiceDb.state).toBe(invoice.address.state);
    expect(invoiceDb.zipCode).toBe(invoice.address.zipCode);
    expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.id);
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price);
    expect(invoiceDb.items[1].id).toEqual(invoice.items[1].id.id);
    expect(invoiceDb.items[1].name).toEqual(invoice.items[1].name);
    expect(invoiceDb.items[1].price).toEqual(invoice.items[1].price);
    expect(invoiceDb.createdAt).toBeDefined;
    expect(invoiceDb.updatedAt).toBeDefined;

  });

  it("should find a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();
    const date = new Date();
    await InvoiceModel.create({
      id: "1",
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
        price: 10,
      }, {
        id: "2",
        name: "Item 2",
        price: 20,
      },],
      createdAt: date,
      updatedAt: date,
    },
      {
        include: [{ model: InvoiceItemModel }],
      })

    const invoice = await invoiceRepository.find("1");

    expect(invoice.id.id).toEqual("1");
    expect(invoice.name).toEqual("Invoice 1");
    expect(invoice.document).toEqual("Document 1");
    expect(invoice.address.street).toBe("Street");
    expect(invoice.address.number).toBe("1");
    expect(invoice.address.complement).toBe("Complement 1");
    expect(invoice.address.city).toBe("City");
    expect(invoice.address.state).toBe("State");
    expect(invoice.address.zipCode).toBe("zipCode");

    expect(invoice.items[0].id.id).toEqual("1");
    expect(invoice.items[0].name).toEqual("Item 1");
    expect(invoice.items[0].price).toEqual(10);
    expect(invoice.items[1].id.id).toEqual("2");
    expect(invoice.items[1].name).toEqual("Item 2");
    expect(invoice.items[1].price).toEqual(20);

    expect(invoice.createdAt).toEqual(date);
    expect(invoice.updatedAt).toEqual(date);

  });
})