import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: 'client',
  timestamps: false
})
export default class ClientModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string

  @Column({ allowNull: false })
  declare name: string

  @Column({ allowNull: false })
  declare email: string

  @Column({ allowNull: false })
  declare address: string

}