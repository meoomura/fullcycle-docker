import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";
import ProductModel from "./product.model";

@Table({
    tableName: "order_product",
    timestamps: false,
  })
  export default class OrderProductModel extends Model {
        
    @ForeignKey(() => OrderModel)
    @Column
    declare orderId: string;
  
    
    @ForeignKey(() => ProductModel)
    @Column
    declare productId: string;
  }