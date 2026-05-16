// web/src/views/Withdraw/Withdraw.tsx
import AccountSelect from "@components/AccountSelect";
import Layout from "@components/Layout";
import Button from "@components/ui/Button";
import PriceField from "@components/ui/Fields/PriceField";
import NewBalance from "@components/ui/NewBalance";
import { Typography } from "@components/ui/Typography";
import { accounts, refetchAccounts } from "@data/accounts";
import { cash, updateCash } from "@data/cash";
import { refetchTransactions } from "@data/transactions";
import { useConfig } from "@hooks/useConfig";
import { useMutation } from "@hooks/useMutation";
import type { ATMInput } from "@typings/Account";
import { AccountEvents } from "@typings/Events";
import { formatMoney } from "@utils/currency";
import { Loader2, Wallet } from 'lucide-solid';
import { createSignal, createMemo, Show } from 'solid-js';
import i18n from "@utils/i18n";

const Withdraw = () => {
  const [amount, setAmount] = createSignal('');
  const [selectedAccountId, setSelectedAccountId] = createSignal<number>(0);
  const config = useConfig();
  
  const selectedAccount = createMemo(() => accounts().find((account) => account.id === selectedAccountId()));

  const value = () => {
      const rawValue = Number.parseInt(amount().replace(/\D/g, ''));
      return isNaN(rawValue) ? 0 : rawValue;
  };
  
  const newAccountBalance = () => (selectedAccount()?.balance ?? 0) - value();
  const isValidNewBalance = () => newAccountBalance() >= 0;
  const isValidTransaction = () => Boolean(amount()) && value() > 0 && selectedAccountId() > 0;

  const { mutate: mutateWithdraw, isLoading } = useMutation(AccountEvents.WithdrawMoney, {
    onSuccess: async () => {
      setAmount('');
      await updateCash();
      await Promise.all([refetchAccounts(), refetchTransactions()]);
    },
  });

  const isButtonDisabled = () => !isValidNewBalance() || !isValidTransaction() || isLoading();

  const handleWithdrawal = () => {
    if (!selectedAccountId()) return;

    const payload: ATMInput = {
      amount: value(),
      message: i18n.t('Withdrew {{amount}} from account.', { amount: formatMoney(value(), config()?.general) }),
      accountId: selectedAccountId(),
    };
    mutateWithdraw(payload);
  };

  return (
    <Layout title={i18n.t('Cash Withdrawal')}>
      <div class='flex flex-col gap-5 max-w-xl'>
        <div class='flex items-center gap-3 p-4 bg-[var(--gta-panel)] border border-[var(--gta-border)] relative'>
          <div class='absolute top-0 left-0 right-0 h-[2px] bg-[var(--gta-yellow)]' />
          <div class='w-8 h-8 flex items-center justify-center bg-[var(--gta-yellow)]/10 border border-[var(--gta-yellow)]/30 text-[var(--gta-yellow)] shrink-0'>
            <Wallet size={16} />
          </div>
          <div class='flex flex-col gap-0.5'>
            <Typography variant='pre' class='text-[10px] text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em]'>
              {i18n.t('Physical Wallet')}
            </Typography>
            <Typography class='text-xl font-bold text-[var(--gta-yellow)] leading-none'>
              {formatMoney(cash(), config()?.general)}
            </Typography>
          </div>
        </div>

        <div class='flex flex-col gap-4'>
          <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div class='flex flex-col gap-3'>
              <Typography variant='label' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5'>
                {i18n.t('Source')}
              </Typography>
              <AccountSelect
                accounts={accounts()}
                isFromAccount={true}
                onSelect={(id) => setSelectedAccountId(id)}
                selectedId={selectedAccountId()}
              />
            </div>

            <div class='flex flex-col gap-1'>
              <Typography variant='label' class='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] px-0.5 mb-2'>
                {i18n.t('Amount')}
              </Typography>
              <PriceField
                placeholder={i18n.t('0.00')}
                value={amount()}
                onChange={(event) => setAmount(event.target.value)}
                error={!isValidNewBalance() && value() > 0}
              />
              <Show when={!isValidNewBalance() && value() > 0}>
                <Typography variant='pre' class='text-[var(--gta-red)] text-[10px] uppercase tracking-[0.15em] mt-1 pl-1'>
                  {i18n.t('Insufficient account funds')}
                </Typography>
              </Show>
              <div class='mt-1 pl-0.5'>
                <NewBalance
                  amount={newAccountBalance()}
                  isValid={isValidNewBalance()}
                  newBalanceText={i18n.t('Post-Withdrawal Balance')}
                />
              </div>
            </div>
          </div>

          <div class='flex flex-col gap-3 pt-2'>
            <Button size='lg' disabled={isButtonDisabled()} onClick={handleWithdrawal} class='w-full'>
              <Show when={isLoading()} fallback={i18n.t('Authorize Withdrawal')}>
                <div class='flex items-center gap-2'>
                  <Loader2 size={16} class='animate-spin' />
                  <span>{i18n.t('Processing Transaction...')}</span>
                </div>
              </Show>
            </Button>

            <div class='flex items-start gap-2 px-3 py-3 bg-[var(--gta-surface)] border border-[var(--gta-border)]'>
              <div class='w-1.5 h-1.5 bg-[var(--gta-yellow)] mt-1 shrink-0' />
              <Typography
                variant='pre'
                class='text-[9px] font-bold text-[var(--gta-text-dim)] leading-relaxed uppercase tracking-[0.1em]'
              >
                {i18n.t(
                  'Funds will be instantly debited from your account and converted to physical currency. Ensure your storage space is sufficient for the liquid assets.',
                )}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Withdraw;
