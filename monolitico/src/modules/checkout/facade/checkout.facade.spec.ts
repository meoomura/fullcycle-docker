import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../infrastructure/config-migrations/migrator";
import { PlaceOrderInputDto } from "../usecase/place-order/place-order.dto";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import ProductAdmModel from "../../product-adm/repository/product.model";
import OrderModel from "../repository/order.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import ClientModel from "../../client-adm/repository/client.model";
import OrderProductModel from "../repository/order.product.model";
import ProductModel from "../../store-catalog/repository/product.model";
import ClientCheckoutModel from "../repository/client.model";
import ProductCheckoutModel from "../repository/product.model";
import TransactionModel from "../../payment/repository/transaction.model";




const clientProps = {
  id: "1c",
  name: "Client",
  email: "client@123.com",
  document: "1234-5678",
  address: new Address(
    "Rua 123",
    "99",
    "Casa Verde",
    "Criciúma",
    "SC",
    "88888-888"
  )
}

const productProps1 = {
  id: '1',
  name: 'Product 1',
  description: 'Product 1 description',
  purchasePrice: 100,
  stock: 10,
};
const productProps2 = {
  id: '2',
  name: 'Product 2',
  description: 'Product 2 description',
  purchasePrice: 200,
  stock: 20,
};

describe("CheckoutFacade test", () => {

  let sequelize: Sequelize
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })

    sequelize.addModels(
      [
        OrderModel,
        ClientModel,
        ProductModel,
        OrderProductModel,
        ProductAdmModel,
        ClientCheckoutModel,
        ProductCheckoutModel,
        InvoiceItemModel,
        InvoiceModel,
        TransactionModel,
      ]);
    migration = migrator(sequelize)
    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it("should create a order approved", async () => {

    const facadeClient = ClientAdmFacadeFactory.create()
    facadeClient.add(clientProps);

    const facadeProduct = ProductAdmFacadeFactory.create()
    facadeProduct.addProduct(productProps1)
    facadeProduct.addProduct(productProps2)

    //atualizei o salesPrice direto na tabela pois não tem método implementado para alterar esse valor.
    await ProductModel.update(
      { salesPrice: 110 },
      { where: { id: 1 } }
    );

    await ProductModel.update(
      { salesPrice: 210 },
      { where: { id: 2 } }
    );

    const placeOrderUseCase = CheckoutFacadeFactory.create();

    const input: PlaceOrderInputDto = {
      clientId: "1c",
      products: [{ productId: "1" }, { productId: "2" }],
    };

    let output = await placeOrderUseCase.process(input);

    expect(output.id).toBeDefined();
    expect(output.invoiceId).toBeDefined();
    expect(output.status).toBe("approved");
    expect(output.total).toBe(320);
    expect(output.products).toEqual([{ productId: '1' }, { productId: '2' }]);
  })

  it("should create a order not approved", async () => {

    const facadeClient = ClientAdmFacadeFactory.create()
    facadeClient.add(clientProps);

    const facadeProduct = ProductAdmFacadeFactory.create()
    facadeProduct.addProduct(productProps1)
    facadeProduct.addProduct(productProps2)

    //atualizei o salesPrice direto na tabela pois não tem método implementado para alterar esse valor.
    ProductModel.update(
      { salesPrice: 10 },
      { where: { id: 1 } }
    );

    ProductModel.update(
      { salesPrice: 20 },
      { where: { id: 2 } }
    );

    const placeOrderUseCase = CheckoutFacadeFactory.create();

    const input: PlaceOrderInputDto = {
      clientId: "1c",
      products: [{ productId: "1" }, { productId: "2" }],
    };

    let output = await placeOrderUseCase.process(input);

    expect(output.id).toBeDefined();
    expect(output.invoiceId).toBeDefined();
    expect(output.status).toBe("pending");
    expect(output.total).toBe(30);
    expect(output.products).toEqual([{ productId: '1' }, { productId: '2' }]);
  })
});