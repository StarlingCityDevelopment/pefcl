import { CashEvents } from '@server/../../typings/Events';
import type { Cash } from '@typings/Cash';
import { DATABASE_PREFIX } from '@utils/constants';
import { config } from '@utils/server-config';
import { DataTypes, Model, type Optional } from 'sequelize';
import { sequelize } from '../../utils/pool';
import { timestamps } from '../timestamps.model';

export class CashModel extends Model<Cash, Optional<Cash, 'id' | 'amount'>> {}

CashModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: config?.cash?.startAmount ?? 0,
    },
    ownerIdentifier: {
      type: DataTypes.STRING,
      unique: true,
    },
    ...timestamps,
  },
  {
    sequelize: sequelize,
    tableName: `${DATABASE_PREFIX}cash`,
    hooks: {
      afterSave: (instance, options) => {
        if (options.fields?.includes('amount')) {
          emit(CashEvents.NewCash, instance.toJSON());
        }
      },
    },
  },
);
