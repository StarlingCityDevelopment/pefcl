import { AccountRole, AccountType } from '@typings/Account';
import { InvoiceStatus } from '@typings/Invoice';
import { AccountModel } from '../services/account/account.model';
import { ExternalAccountModel } from '../services/accountExternal/externalAccount.model';
import { CashModel } from '../services/cash/cash.model';
import { InvoiceModel } from '../services/invoice/invoice.model';
import { mainLogger } from '../sv_logger';

const logger = mainLogger.child({ module: 'mockSeed' });

export const seedDatabase = async () => {
  logger.info('Seeding mock data...');

  const johnDoeIdentifier = 'custom-character-identifier:john-doe';

  // Seed Accounts
  const accounts = await AccountModel.bulkCreate([
    {
      id: 1,
      accountName: 'Savings',
      number: '920, 1000-2000-3000',
      balance: 4500,
      isDefault: true,
      ownerIdentifier: johnDoeIdentifier,
      type: AccountType.Personal,
      role: AccountRole.Owner,
    },
    {
      id: 2,
      accountName: 'Pension',
      number: '920, 1000-2000-3002',
      balance: 20000,
      isDefault: false,
      ownerIdentifier: johnDoeIdentifier,
      type: AccountType.Personal,
      role: AccountRole.Owner,
    },
    {
      id: 3,
      accountName: 'Business Account',
      number: '920, 2000-3000-4000',
      balance: 100000,
      isDefault: true,
      ownerIdentifier: 'license:mock-repair-shop',
      type: AccountType.Personal,
      role: AccountRole.Owner,
    },
  ]);

  // Seed Cash
  await CashModel.findOrCreate({
    where: { ownerIdentifier: johnDoeIdentifier },
    defaults: {
      amount: 2500,
      ownerIdentifier: johnDoeIdentifier,
    },
  });

  // Seed Invoices
  await InvoiceModel.bulkCreate([
    {
      id: 1,
      amount: 8000,
      from: 'Repair shop',
      to: 'John Doe',
      message: 'For the car mate',
      fromIdentifier: 'license:mock-repair-shop',
      toIdentifier: johnDoeIdentifier,
      status: InvoiceStatus.PENDING,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toString(),
    },
    {
      id: 2,
      amount: 2000,
      from: 'Repair shop',
      to: 'John Doe',
      message: 'Repairs',
      fromIdentifier: 'license:mock-repair-shop',
      toIdentifier: johnDoeIdentifier,
      status: InvoiceStatus.PAID,
      expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toString(),
    },
  ]);

  // Seed External Accounts
  await ExternalAccountModel.bulkCreate([
    {
      id: 1,
      number: '920, 1111-2222-3333',
      name: 'Jane Smith',
      userId: johnDoeIdentifier,
    },
  ]);

  logger.info('Mock data seeded successfully!');
};
