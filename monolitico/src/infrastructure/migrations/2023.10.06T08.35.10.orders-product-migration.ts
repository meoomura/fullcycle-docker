import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('order_product', {
    orderId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'orders', 
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'products', 
        key: 'id',
      },
    },
    
  })
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('order_product')
} 
