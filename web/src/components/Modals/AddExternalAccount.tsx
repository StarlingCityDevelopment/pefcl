// web/src/components/Modals/AddExternalAccount.tsx
import { regexExternalNumber } from "@common/utils/regexes";
import Button from "@components/ui/Button";
import TextField from "@components/ui/Fields/TextField";
import { Typography } from "@components/ui/Typography";
import { refetchExternalAccounts } from "@data/externalAccounts";
import { AccountErrors, ExternalAccountErrors, GenericErrors } from "@typings/Errors";
import { ExternalAccountEvents } from "@typings/Events";
import { fetchNui } from "@utils/fetchNui";
import { Loader2, Plus } from 'lucide-solid';
import { createSignal, Show } from 'solid-js';
import i18n from "@utils/i18n";
import { Modal } from "@ui/Modal";

interface AddExternalAccountModalProps {
  isOpen: boolean;
  onClose(): void;
}

const AddExternalAccountModal = (props: AddExternalAccountModalProps) => {
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [number, setNumber] = createSignal('');
  const [name, setName] = createSignal('');
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});

  const handleClose = () => {
    props.onClose();
    setError('');
    setNumber('');
    setName('');
    setFieldErrors({});
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!number()) {
      errors.number = i18n.t('Clearing- & account number is required');
    } else if (!regexExternalNumber.test(number())) {
      errors.number = i18n.t('Invalid number, format is: xxx, xxxx-xxxx-xxxx');
    }
    if (!name()) {
      errors.name = i18n.t('Account name is required');
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError('');

    try {
      await fetchNui(ExternalAccountEvents.Add, { number: number(), name: name() });
      await refetchExternalAccounts();
      setIsLoading(false);
      props.onClose();
    } catch (err: any) {
      setIsLoading(false);
      const message = err.message;

      if (message === AccountErrors.AlreadyExists) {
        setError(i18n.t('An account for the specified number already exists'));
      } else if (message === GenericErrors.NotFound) {
        setError(i18n.t('The specified number does not match an existing account'));
      } else if (message === ExternalAccountErrors.AccountIsYours) {
        setError(i18n.t('You already have access to this account. Use internal transfer instead'));
      } else {
        setError(i18n.t('Something went wrong, please try again later.'));
      }
    }
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose} title={i18n.t('Register Entity')} maxWidth='md'>
      <div class='flex flex-col h-full'>
        <Typography variant='label' class='mb-6 text-white/60'>
          {i18n.t('Secure External Registration')}
        </Typography>

        <form onSubmit={onSubmit} class='flex flex-col gap-5 h-full'>
          <div class='flex flex-col gap-1.5'>
            <TextField
              label={i18n.t('Clearing- & account number')}
              placeholder={'xxx, xxxx-xxxx-xxxx'}
              value={number()}
              onChange={(e: any) => setNumber(e.target.value)}
              error={!!fieldErrors().number}
            />
            <Show when={fieldErrors().number}>
              <Typography variant='pre' class='text-red-500/80 px-2 mt-1 lowercase text-[11px]'>
                {fieldErrors().number}
              </Typography>
            </Show>
          </div>

          <div class='flex flex-col gap-1.5'>
            <TextField
              placeholder={i18n.t('Example: Main Business')}
              label={i18n.t('Entity Name')}
              value={name()}
              onChange={(e: any) => setName(e.target.value)}
              error={!!fieldErrors().name}
            />
            <Show when={fieldErrors().name}>
              <Typography variant='pre' class='text-red-500/80 px-2 mt-1 lowercase text-[11px]'>
                {fieldErrors().name}
              </Typography>
            </Show>
          </div>

          <Show when={error()}>
            <div class='p-3 rounded-xl bg-red-500/10 border border-red-500/20'>
              <Typography variant='pre' class='text-red-500 text-xs'>
                {error()}
              </Typography>
            </div>
          </Show>

          <div class='flex justify-end gap-3 mt-auto pt-6 border-t border-white/5'>
            <Button variant='secondary' onClick={handleClose} disabled={isLoading()}>
              {i18n.t('Cancel')}
            </Button>
            <Button type='submit' disabled={isLoading()}>
              <Show when={isLoading()} fallback={
                <div class='flex items-center justify-center gap-2'>
                  <Plus size={16} />
                  <span>{i18n.t('Register')}</span>
                </div>
              }>
                <Loader2 size={16} class='animate-spin text-black' />
              </Show>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddExternalAccountModal;
