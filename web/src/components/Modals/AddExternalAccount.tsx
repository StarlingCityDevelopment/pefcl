import { regexExternalNumber } from '@common/utils/regexes';
import Button from '@components/ui/Button';
import TextField from '@components/ui/Fields/TextField';
import { Typography } from '@components/ui/Typography';
import { externalAccountsAtom } from '@data/externalAccounts';
import { AccountErrors, ExternalAccountErrors, GenericErrors } from '@typings/Errors';
import { ExternalAccountEvents } from '@typings/Events';
import { fetchNui } from '@utils/fetchNui';
import { useAtom } from 'jotai';
import { Loader2, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';

interface FormValues {
  name: string;
  number: string;
}

interface AddExternalAccountModalProps {
  isOpen: boolean;
  onClose(): void;
}

const AddExternalAccountModal = ({ isOpen, onClose }: AddExternalAccountModalProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [, updateExternalAccounts] = useAtom(externalAccountsAtom);

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      number: '',
      name: '',
    },
  });

  const handleClose = () => {
    onClose();
    setError('');
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError('');

    try {
      await fetchNui(ExternalAccountEvents.Add, values);
      updateExternalAccounts();
      setIsLoading(false);
      onClose();
    } catch (error) {
      setIsLoading(false);
      if (!(error instanceof Error)) {
        return;
      }

      if (error.message === AccountErrors.AlreadyExists) {
        setError(t('An account for the specified number already exists'));
        return;
      }

      if (error.message === GenericErrors.NotFound) {
        setError(t('The specified number does not match an existing account'));
        return;
      }

      if (error.message === ExternalAccountErrors.AccountIsYours) {
        setError(t('You already have access to this account. Use internal transfer instead'));
        return;
      }

      setError(t('Something went wrong, please try again later.'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('Register Entity')} maxWidth='md'>
      <div className='flex flex-col h-full'>
        <Typography variant='label' className='mb-6 text-white/60'>
          {t('Secure External Registration')}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 h-full'>
          <div className='flex flex-col gap-1.5'>
            <Controller
              name='number'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t('Clearing- & account number is required'),
                },
                pattern: {
                  value: regexExternalNumber,
                  message: t('Invalid number, format is: xxx, xxxx-xxxx-xxxx'),
                },
              }}
              render={({ field }) => (
                <TextField
                  label={t('Clearing- & account number')}
                  placeholder={'xxx, xxxx-xxxx-xxxx'}
                  {...field}
                  error={!!formState.errors.number}
                />
              )}
            />
            {formState.errors.number && (
              <Typography variant='pre' className='text-red-500/80 px-2 mt-1 lowercase text-[11px]'>
                {formState.errors.number.message}
              </Typography>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Controller
              name='name'
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t('Account name is required'),
                },
              }}
              render={({ field }) => (
                <TextField
                  placeholder={t('Example: Main Business')}
                  label={t('Entity Name')}
                  {...field}
                  error={!!formState.errors.name}
                />
              )}
            />
            {formState.errors.name && (
              <Typography variant='pre' className='text-red-500/80 px-2 mt-1 lowercase text-[11px]'>
                {formState.errors.name.message}
              </Typography>
            )}
          </div>

          {error && (
            <div className='p-3 rounded-xl bg-red-500/10 border border-red-500/20'>
              <Typography variant='pre' className='text-red-500 text-xs'>
                {error}
              </Typography>
            </div>
          )}

          <div className='flex justify-end gap-3 mt-auto pt-6 border-t border-white/5'>
            <Button variant='secondary' onClick={handleClose} disabled={isLoading}>
              {t('Cancel')}
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? (
                <Loader2 className='w-4 h-4 animate-spin text-black' />
              ) : (
                <div className='flex items-center justify-center gap-2'>
                  <Plus className='w-4 h-4' />
                  <span>{t('Register')}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddExternalAccountModal;
