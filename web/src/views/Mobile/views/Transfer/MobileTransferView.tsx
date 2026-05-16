// web/src/views/Mobile/views/Transfer/MobileTransferView.tsx
import AccountSelect from "@components/AccountSelect";
import Button from "@components/ui/Button";
import PriceField from "@components/ui/Fields/PriceField";
import NewBalance from "@components/ui/NewBalance";
import { Typography } from "@components/ui/Typography";
import { accounts, refetchAccounts } from "@data/accounts";
import { externalAccounts, refetchExternalAccounts } from "@data/externalAccounts";
import { refetchTransactions } from "@data/transactions";
import { useConfig } from "@hooks/useConfig";
import { GenericErrors } from "@typings/Errors";
import { TransactionEvents } from "@typings/Events";
import { type CreateTransferInput, TransferType } from "@typings/Transaction";
import { cn } from "@utils/cn";
import { formatMoney } from "@utils/currency";
import { fetchNui } from "@utils/fetchNui";
import { AlertCircle, Info } from 'lucide-solid';
import { createSignal, createMemo, Show } from 'solid-js';
import i18n from "@utils/i18n";

const MobileTransferView = () => {
  const config = useConfig();

  const [success, setSuccess] = createSignal('');
  const [error, setError] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [amount, setAmount] = createSignal('');
  const [selectedFromAccountId, setSelectedFromAccountId] = createSignal<number>(0);
  const [selectedToAccountId, setSelectedToAccountId] = createSignal<number>(0);
  const [isToExternal, setIsToExternal] = createSignal(false);

  const selectedFromAccount = createMemo(() => accounts().find((account) => account.id === selectedFromAccountId()));

  const value = () => {
      const rawValue = Number.parseInt(amount().replace(/\D/g, ''));
      return isNaN(rawValue) ? 0 : rawValue;
  };
  
  const newBalance = () => (selectedFromAccount()?.balance ?? 0) - value();
  const isValidNewBalance = () => newBalance() >= 0;
  const isValidTransaction = () => Boolean(amount()) && value() > 0 && selectedFromAccountId() > 0 && selectedToAccountId() > 0;
  const isSameAccount = () => !isToExternal() && selectedFromAccountId() === selectedToAccountId();
  const isButtonDisabled = () => !isValidNewBalance() || !isValidTransaction() || isSameAccount() || isLoading();

  const message = () => isToExternal() ? i18n.t('External transfer') : i18n.t('Internal transfer');
  const type = () => isToExternal() ? TransferType.External : TransferType.Internal;

  const handleToSelect = (id: number, isExternal?: boolean) => {
    setSuccess('');
    setError('');
    setSelectedToAccountId(id);
    setIsToExternal(isExternal ?? false);
  };

  const handleFromSelect = (id: number) => {
    setSuccess('');
    setError('');
    setSelectedFromAccountId(id);
  };

  const handleAmountChange = (event: any) => {
    setSuccess('');
    setError('');
    setAmount(event.target.value);
  };

  const handleTransfer = async () => {
    if (!selectedFromAccountId() || !selectedToAccountId()) {
      return;
    }

    setIsLoading(true);
    const transfer: CreateTransferInput = {
      amount: value(),
      fromAccountId: selectedFromAccountId(),
      toAccountId: selectedToAccountId(),
      message: message(),
      type: type(),
    };

    try {
      await fetchNui(TransactionEvents.CreateTransfer, transfer);
      setSuccess(i18n.t('Successfully transferred {{amount}}.', { amount: formatMoney(value(), config()?.general) }));
      setIsLoading(false);
      await Promise.all([refetchAccounts(), refetchExternalAccounts(), refetchTransactions()]);
      setAmount('');
    } catch (err: any) {
      if (err.message === GenericErrors.NotFound) {
        setError(i18n.t('No account found to receive transfer.'));
      } else {
        setError(err.message || i18n.t('Something went wrong, please try again later.'));
      }
      setIsLoading(false);
      await Promise.all([refetchAccounts(), refetchExternalAccounts(), refetchTransactions()]);
    }
  };

  return (
    <div class='p-6 pb-24 flex flex-col gap-10'>
      <div class='flex flex-col gap-1'>
        <Typography variant='h2' class='text-[2rem] leading-none mb-2 italic uppercase'>
          {i18n.t('Transfer funds')}
        </Typography>
        <Typography class='text-white/40 font-medium'>
          {i18n.t('Transfer between internal & external accounts.')}
        </Typography>
      </div>

      <div class='flex flex-col gap-10'>
        <div class='flex flex-col gap-4'>
          <Typography variant='pre' class='text-primary font-black ml-1'>
            {i18n.t('From account')}
          </Typography>
          <AccountSelect
            isFromAccount
            accounts={accounts()}
            onSelect={handleFromSelect}
            selectedId={selectedFromAccountId()}
          />
        </div>

        <div class='flex flex-col gap-4'>
          <Typography variant='pre' class='text-primary font-black ml-1'>
            {i18n.t('To account')}
          </Typography>
          <AccountSelect
            accounts={accounts()}
            externalAccounts={externalAccounts()}
            onSelect={handleToSelect}
            selectedId={selectedToAccountId()}
            isExternalSelected={isToExternal()}
          />
        </div>

        <div class='flex flex-col gap-4'>
          <Typography variant='pre' class='text-primary font-black ml-1'>
            {i18n.t('Value Specification')}
          </Typography>
          <PriceField value={amount()} onChange={handleAmountChange} />
          <NewBalance amount={newBalance()} isValid={isValidNewBalance()} />
        </div>

        <div class='pt-4'>
          <Button class='w-full h-16 text-lg' onClick={handleTransfer} disabled={isButtonDisabled()}>
            {i18n.t('Authorize Transfer')}
          </Button>
        </div>

        <Show when={success()}>
          <div class='p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-4 text-blue-400'>
            <Info size={20} class='shrink-0' />
            <Typography class='text-blue-400 leading-tight'>{success()}</Typography>
          </div>
        </Show>

        <Show when={error()}>
          <div class='p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-500'>
            <AlertCircle size={20} class='shrink-0' />
            <Typography class='text-red-500 leading-tight font-medium'>{error()}</Typography>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default MobileTransferView;
