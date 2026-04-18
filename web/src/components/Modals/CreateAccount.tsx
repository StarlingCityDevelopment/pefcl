import { regexAlphaNumeric } from '@common/utils/regexes';
import { transactionBaseAtom } from '@data/transactions';
import { useMutation } from '@hooks/useMutation';
import { AccountEvents } from '@typings/Events';
import { cn } from '@utils/cn';
import { useAtom, useAtomValue } from 'jotai';
import type React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { accountsAtom, defaultAccountAtom } from '../../data/accounts';
import { useConfig } from '../../hooks/useConfig';
import AccountSelect from '../AccountSelect';
import Summary from '../Summary';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Typography } from '../ui/Typography';

interface CreateAccountForm {
  accountName: string;
  isDefault: boolean;
  isShared: boolean;
  fromAccountId: number;
}

const CreateAccountModal: React.FC<{ onClose(): void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const config = useConfig();
  const [, updateAccounts] = useAtom(accountsAtom);
  const accounts = useAtomValue(accountsAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const defaultAccount = useAtomValue(defaultAccountAtom);

  const { control, handleSubmit, watch } = useForm<CreateAccountForm>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      accountName: '',
      isShared: false,
      isDefault: false,
      fromAccountId: defaultAccount?.id ?? 0,
    },
  });

  const watchedAccountId = watch('fromAccountId');
  const selectedAccount = accounts.find((account) => account.id === Number(watchedAccountId));

  const isFirstSetup = accounts.length === 0;
  const isDisabled = (selectedAccount?.balance ?? 0) < config?.prices?.newAccount && !isFirstSetup;

  const { mutate: mutateCreate, isLoading: isCreating } = useMutation(AccountEvents.CreateAccount, {
    successMessage: t('Successfully created account'),
    onSuccess: async () => {
      await updateAccounts();
      await updateTransactions();
      onClose();
    },
  });

  const onSubmit = (values: CreateAccountForm) => {
    mutateCreate({
      ...values,
      fromAccountId: Number(values.fromAccountId),
    });
  };

  return (
    <div className='flex flex-col h-full'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 h-full'>
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-4'>
            <Controller
              name='accountName'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t('Account name is required'),
                },
                maxLength: {
                  value: 25,
                  message: t('Account name is too long'),
                },
                pattern: {
                  value: regexAlphaNumeric,
                  message: t('Invalid account name'),
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  label={t('Account name')}
                  placeholder={t('Savings, Business, etc.')}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name='isShared'
              control={control}
              render={({ field }) => (
                <label className='flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors'>
                  <input
                    type='checkbox'
                    className='w-4 h-4 rounded-md bg-transparent border-white/20 text-white focus:ring-white/20 transition-all cursor-pointer'
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  <Typography
                    variant='pre'
                    className='text-sm font-medium text-slate-400 group-hover:text-white transition-colors'
                  >
                    {t('This is a shared account')}
                  </Typography>
                </label>
              )}
            />
          </div>

          <div className='h-px w-full bg-white/5 my-2' />

          <div className='flex flex-col gap-4'>
            <Typography variant='label' className='text-white/60'>
              {t('Payment Source')}
            </Typography>
            <Controller
              name='fromAccountId'
              control={control}
              render={({ field }) => (
                <AccountSelect
                  isFromAccount
                  accounts={accounts}
                  onSelect={field.onChange}
                  selectedId={Number(field.value)}
                />
              )}
            />

            <div className='mt-1'>
              <Summary balance={selectedAccount?.balance ?? 0} payment={config.prices.newAccount} />
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-6 border-t border-white/5 mt-auto'>
          <Button variant='secondary' onClick={onClose} type='button'>
            {t('Cancel')}
          </Button>
          <Button disabled={isDisabled || isCreating} type='submit'>
            {isCreating ? t('Processing...') : t('Create Account')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountModal;
