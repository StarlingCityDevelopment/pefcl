import { AccountEvents } from '@server/../../typings/Events';
import { type Account, AccountRole, AccountType } from '@typings/Account';
import { DATABASE_PREFIX } from '@utils/constants';
import { generateClearingNumber } from '@utils/misc';
import { sequelize } from '@utils/pool';
import { config } from '@utils/server-config';
import { DataTypes, Model, type Optional } from 'sequelize';
import { timestamps } from '../timestamps.model';

export class AccountModel extends Model<
  Account,
  Optional<Account, 'id' | 'number' | 'balance' | 'role' | 'isDefault'>
> {}

AccountModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: generateClearingNumber,
    },
    accountName: {
      type: DataTypes.STRING,
      validate: {
        max: 25,
        min: 1,
      },
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ownerIdentifier: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: AccountRole.Owner,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: config?.accounts?.otherAccountStartBalance ?? 0,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: AccountType.Personal,
    },
    ...timestamps,
  },
  {
    sequelize: sequelize,
    tableName: `${DATABASE_PREFIX}accounts`,
    paranoid: true,
    hooks: {
      afterSave: (instance, options) => {
        if (options.fields?.includes('balance')) {
          emit(AccountEvents.NewBalance, instance.toJSON());
        }
      },
    },
  },
);
