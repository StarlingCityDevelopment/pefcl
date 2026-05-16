// web/src/components/TransferFunds.tsx
import { externalAccounts } from "@data/externalAccounts";
import { refetchTransactions } from "@data/transactions";
import { useMutation } from "@hooks/useMutation";
import { TransactionEvents } from "@typings/Events";
import { type CreateTransferInput, TransferType } from "@typings/Transaction";
import { cn } from "@utils/cn";
import { createSignal, createMemo, Show } from 'solid-js';
import i18n from "@utils/i18n";
import { accounts, refetchAccounts, defaultAccount } from "@data/accounts";
import AccountSelect from './AccountSelect';
import Button from './ui/Button';
import PriceField from './ui/Fields/PriceField';
import NewBalance from './ui/NewBalance';
import { Typography } from './ui/Typography';

const TransferFunds = (props: { onClose?(): void }) => {
  const [amount, setAmount] = createSignal('');
  const [fromAccountId, setFromAccountId] = createSignal(defaultAccount()?.id ?? 0);
  const [toAccountId, setToAccountId] = createSignal(0);
  const [isToExternal, setIsToExternal] = createSignal(false);

  const { mutate: mutateTransfer, isLoading: isTransfering } = useMutation(TransactionEvents.CreateTransfer, {
    successMessage: i18n.t('Successfully transferred funds'),
    onSuccess: async () => {
      await refetchAccounts();
      await refetchTransactions();
      props.onClose?.();
      setAmount('');
    },
  });

  const parsedAmount = () => Number(amount().replace(/\D/g, ''));
  const fromAccount = createMemo(() => accounts().find((account) => account.id === fromAccountId()));

  const message = () => isToExternal() ? i18n.t('External transfer') : i18n.t('Internal transfer');
  const type = () => isToExternal() ? TransferType.External : TransferType.Internal;

  const handleTransfer = () => {
    const payload: CreateTransferInput = {
      type: type(),
      message: message(),
      amount: parsedAmount(),
      fromAccountId: fromAccountId(),
      toAccountId: toAccountId(),
    };
    mutateTransfer(payload);
  };

  const handleToSelect = (id: number, isExternal?: boolean) => {
    setToAccountId(id);
    setIsToExternal(isExternal ?? false);
  };

  const isAmountTooHigh = () => {
      const account = fromAccount();
      return account && account.balance < parsedAmount();
  };
  const isAmountTooLow = () => parsedAmount() <= 0;
  const isToAccountSelected = () => toAccountId() > 0;
  const isSameAccount = () => !isToExternal() && toAccountId() === fromAccountId();
  const isDisabled = () => isSameAccount() || !parsedAmount() || !isToAccountSelected() || isAmountTooHigh() || isAmountTooLow();

  const value = () => {
      const rawValue = Number.parseInt(amount().replace(/\D/g, ''));
      return isNaN(rawValue) ? 0 : rawValue;
  };
  const newBalance = () => (fromAccount()?.balance ?? 0) - value();
  const isValidNewBalance = () => newBalance() >= 0;

  return (
    <div class='relative flex flex-col gap-6 pt-2'>
      <Show when={isTransfering()}>
        <div class='absolute top-0 left-0 right-0 h-[2px] overflow-hidden'>
          <div class='h-full bg-[var(--gta-green)] animate-[shimmer_2s_infinite] w-[40%]' />
        </div>
      </Show>

      <div class='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div class='flex flex-col gap-2'>
          <Typography variant='pre' class='text-[10px] font-bold text-[var(--gta-text-dim)] uppercase tracking-[0.15em] ml-0.5'>
            {i18n.t('Source Account')}
          </Typography>
          <AccountSelect
            isFromAccount
            onSelect={(id) => setFromAccountId(id)}
            accounts={accounts()}
            selectedId={fromAccountId()}
          />
        </div>

        <div class='flex flex-col gap-2'>
          <Typography variant='pre' class='text-[10px] font-bold text-[var(--gta-text-dim)] uppercase tracking-[0.15em] ml-0.5'>
            {i18n.t('Beneficiary Account')}
          </Typography>
          <AccountSelect
            onSelect={handleToSelect}
            accounts={accounts()}
            excludeId={fromAccountId()}
            selectedId={toAccountId()}
            isExternalSelected={isToExternal()}
            externalAccounts={externalAccounts()}
          />
        </div>
      </div>

      <div class='flex flex-col gap-2'>
        <Typography variant='pre' class='text-[10px] font-bold text-[var(--gta-text-dim)] uppercase tracking-[0.15em] ml-0.5'>
          {i18n.t('Amount')}
        </Typography>
        <PriceField placeholder={i18n.t('Amount')} value={amount()} onChange={(event) => setAmount(event.target.value)} />
        <div class='mt-1'>
          <NewBalance amount={newBalance()} isValid={isValidNewBalance()} />
        </div>
      </div>

      <div class='flex justify-end gap-2 pt-3 border-t border-[var(--gta-border)]'>
        <Button disabled={isDisabled() || isTransfering()} onClick={handleTransfer} class='px-6 py-2'>
          {i18n.t('Confirm Transfer')}
        </Button>
      </div>
    </div>
  );
};

export default TransferFunds;
