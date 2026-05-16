// web/src/components/Modals/CreateAccount.tsx
import { regexAlphaNumeric } from "@common/utils/regexes";
import { refetchTransactions } from "@data/transactions";
import { useMutation } from "@hooks/useMutation";
import { AccountEvents } from "@typings/Events";
import { cn } from "@utils/cn";
import { createSignal, createMemo, Show, For } from 'solid-js';
import i18n from "@utils/i18n";
import { accounts, refetchAccounts, defaultAccount } from "@data/accounts";
import { useConfig } from "@hooks/useConfig";
import AccountSelect from '../AccountSelect';
import Summary from '../Summary';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Typography } from '../ui/Typography';

const CreateAccountModal = (props: { onClose(): void }) => {
  const config = useConfig();
  
  const [accountName, setAccountName] = createSignal('');
  const [isShared, setIsShared] = createSignal(false);
  const [isDefault, setIsDefault] = createSignal(false);
  const [fromAccountId, setFromAccountId] = createSignal<number>(defaultAccount()?.id ?? 0);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});

  const selectedAccount = createMemo(() => accounts().find((account) => account.id === fromAccountId()));
  const isFirstSetup = createMemo(() => accounts().length === 0);
  const isDisabled = createMemo(() => (selectedAccount()?.balance ?? 0) < (config()?.prices?.newAccount || 0) && !isFirstSetup());

  const { mutate: mutateCreate, isLoading: isCreating } = useMutation(AccountEvents.CreateAccount, {
    successMessage: i18n.t('Successfully created account'),
    onSuccess: async () => {
      await refetchAccounts();
      await refetchTransactions();
      props.onClose();
    },
  });

  const validate = () => {
      const errors: Record<string, string> = {};
      if (!accountName()) {
          errors.accountName = i18n.t('Account name is required');
      } else if (accountName().length > 25) {
          errors.accountName = i18n.t('Account name is too long');
      } else if (!regexAlphaNumeric.test(accountName())) {
          errors.accountName = i18n.t('Invalid account name');
      }
      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const onSubmit = (e: Event) => {
    e.preventDefault();
    if (!validate()) return;
    
    mutateCreate({
      accountName: accountName(),
      isShared: isShared(),
      isDefault: isDefault(),
      fromAccountId: Number(fromAccountId()),
    });
  };

  return (
    <div class='flex flex-col h-full'>
      <form onSubmit={onSubmit} class='flex flex-col gap-6 h-full'>
        <div class='flex flex-col gap-5'>
          <div class='flex flex-col gap-4'>
            <Input
                label={i18n.t('Account name')}
                placeholder={i18n.t('Savings, Business, etc.')}
                value={accountName()}
                onInput={(e: any) => setAccountName(e.target.value)}
                error={!!fieldErrors().accountName}
                helperText={fieldErrors().accountName}
            />

            <label class='flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors'>
                <input
                type='checkbox'
                class='w-4 h-4 rounded-md bg-transparent border-white/20 text-white focus:ring-white/20 transition-all cursor-pointer'
                checked={isShared()}
                onChange={(e) => setIsShared(e.currentTarget.checked)}
                />
                <Typography
                variant='pre'
                class='text-sm font-medium text-slate-400 group-hover:text-white transition-colors'
                >
                {i18n.t('This is a shared account')}
                </Typography>
            </label>
          </div>

          <div class='h-px w-full bg-white/5 my-2' />

          <div class='flex flex-col gap-4'>
            <Typography variant='label' class='text-white/60'>
              {i18n.t('Payment Source')}
            </Typography>
            
            <AccountSelect
                isFromAccount
                accounts={accounts()}
                onSelect={(id) => setFromAccountId(id)}
                selectedId={fromAccountId()}
            />

            <div class='mt-1'>
              <Summary balance={selectedAccount()?.balance ?? 0} payment={config()?.prices.newAccount || 0} />
            </div>
          </div>
        </div>

        <div class='flex justify-end gap-3 pt-6 border-t border-white/5 mt-auto'>
          <Button variant='secondary' onClick={() => props.onClose()} type='button'>
            {i18n.t('Cancel')}
          </Button>
          <Button disabled={isDisabled() || isCreating()} type='submit'>
            <Show when={isCreating()} fallback={i18n.t('Create Account')}>
                {i18n.t('Processing...')}
            </Show>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountModal;
