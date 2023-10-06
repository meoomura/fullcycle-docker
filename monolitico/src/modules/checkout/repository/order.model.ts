import { BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ClientModel  from "./client.model";
import ProductModel from "./product.model";
import OrderProductModel from "./order.product.model";

@Table({
    tableName: "orders",
    timestamps: false,
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => ClientModel)
    @Column({ allowNull: false })
    declare client_id: string;

    @BelongsTo(() => ClientModel)
    declare client: ClientModel;

    @BelongsToMany(() => ProductModel, () => OrderProductModel)
    declare products: ProductModel[];

    @Column({ allowNull: false })
    declare status: string;

}

