import { AccountCard } from '@components/AccountCard';
import TotalBalance from '@components/TotalBalance';
import { Typography } from '@components/ui/Typography';
import { accountsAtom } from '@data/accounts';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

const MobileAccountsView = () => {
  const { t } = useTranslation();
  const [accounts] = useAtom(accountsAtom);

  return (
    <div className="p-6 pb-24 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Typography variant="h2" className="text-[2rem] leading-none mb-2 italic uppercase">
          {t('Accounts')}
        </Typography>
        <TotalBalance />
      </div>

      <div className="flex flex-col gap-5">
        {accounts.map((account) => {
          return <AccountCard account={account} key={account.id} />;
        })}
      </div>

      {accounts.length <= 1 && (
        <div className="p-8 text-center rounded-[2.5rem] bg-white/[0.02] border border-white/5 border-dashed">
          <Typography className="text-white/40 leading-relaxed font-medium text-sm">
            {t('You can create more accounts by visiting the nearest bank.')}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default MobileAccountsView;

