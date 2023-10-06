import express, { Express } from "express"
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug"
import { productRoute } from "./routes/product.route";
import { migrator } from "../config-migrations/migrator";
import { clientRoute } from "./routes/client.route";
import ProductAdmModel from "../../modules/product-adm/repository/product.model";
import ProductModel from "../../modules/store-catalog/repository/product.model";
import ClientModel from "../../modules/client-adm/repository/client.model";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { checkoutRoute } from "./routes/checkout.route";
import { invoiceRoute } from "./routes/invoice.route";

export const app: Express = express();
app.use(express.json());
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout",checkoutRoute);
app.use("/invoice",invoiceRoute);

export let sequelize: Sequelize;
export let migration: Umzug<any>;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ":memory:",
        logging: false
    });

    sequelize.addModels([ProductModel, ProductAdmModel, ClientModel, InvoiceModel, InvoiceItemModel, TransactionModel])
    migration = migrator(sequelize)
    await migration.up()
}

setupDb();