// web/src/views/Cards/components/CardActions.tsx
import Button from "@components/ui/Button";
import { Modal } from "@components/ui/Modal";
import { Typography } from "@components/ui/Typography";
import { useMutation } from "@hooks/useMutation";
import { CardEvents } from "@typings/Events";
import { cn } from "@utils/cn";
import { AlertCircle, Key, ShieldAlert, ShieldCheck, ShieldX, Trash2 } from 'lucide-solid';
import { createSignal, Show } from 'solid-js';
import i18n from "@utils/i18n";

interface ActionProps {
  cardId: number;
  onSuccess?: () => void;
  isLoading?: boolean;
}

const UpdatePinAction = (props: ActionProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [newPin, setNewPin] = createSignal('');
  const [confirmNewPin, setConfirmNewPin] = createSignal('');

  const { mutate: mutateUpdatePin, isLoading } = useMutation(CardEvents.UpdatePin, {
    successMessage: i18n.t('Successfully updated pin.'),
    onSuccess: () => {
      setIsOpen(false);
      setNewPin('');
      setConfirmNewPin('');
      props.onSuccess?.();
    },
  });

  const handleUpdatePin = async () => {
    if (confirmNewPin() !== newPin()) return;
    await mutateUpdatePin({ cardId: props.cardId, newPin: Number.parseInt(newPin(), 10) });
  };

  return (
    <>
      <Button class='w-full justify-start h-10 px-4 text-xs' variant='secondary' onClick={() => setIsOpen(true)}>
        <Key size={14} class='mr-2.5 opacity-50' />
        {i18n.t('Update pin')}
      </Button>

      <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} title={i18n.t('Update pin')} maxWidth='sm'>
        <div class='flex flex-col gap-5'>
          <div class='flex flex-col gap-4'>
            <div class='flex flex-col gap-1.5'>
              <Typography variant='pre' class='text-[var(--gta-text-dim)] font-bold ml-0.5'>
                {i18n.t('New pin')}
              </Typography>
              <input
                type='password'
                maxLength={4}
                placeholder='••••'
                value={newPin()}
                onInput={(e) => setNewPin(e.currentTarget.value)}
                class='w-full h-12 bg-[var(--gta-surface)] border border-[var(--gta-border)] px-6 text-xl tracking-[0.5em] font-bold text-[var(--gta-text)] focus:outline-none focus:border-[var(--gta-green)] focus:shadow-[0_0_8px_var(--gta-green-glow)] transition-all text-center placeholder:text-[var(--gta-text-dim)]'
              />
            </div>

            <div class='flex flex-col gap-1.5'>
              <Typography variant='pre' class='text-[var(--gta-text-dim)] font-bold ml-0.5'>
                {i18n.t('Confirm new pin')}
              </Typography>
              <input
                type='password'
                maxLength={4}
                placeholder='••••'
                value={confirmNewPin()}
                onInput={(e) => setConfirmNewPin(e.currentTarget.value)}
                class='w-full h-12 bg-[var(--gta-surface)] border border-[var(--gta-border)] px-6 text-xl tracking-[0.5em] font-bold text-[var(--gta-text)] focus:outline-none focus:border-[var(--gta-green)] focus:shadow-[0_0_8px_var(--gta-green-glow)] transition-all text-center placeholder:text-[var(--gta-text-dim)]'
              />
            </div>

            <Show when={confirmNewPin() !== newPin() && confirmNewPin().length > 0}>
              <div class='flex items-center gap-3 p-3 bg-[var(--gta-red)]/10 border border-[var(--gta-red)]/30'>
                <AlertCircle size={16} class='shrink-0 text-[var(--gta-red)]' />
                <Typography class='text-xs font-bold text-[var(--gta-red)]'>{i18n.t('Pins do not match')}</Typography>
              </div>
            </Show>
          </div>

          <div class='flex justify-end gap-2 pt-3 border-t border-[var(--gta-border)]'>
            <Button variant='secondary' onClick={() => setIsOpen(false)}>
              {i18n.t('Cancel')}
            </Button>
            <Button onClick={handleUpdatePin} disabled={isLoading() || confirmNewPin() !== newPin() || newPin().length === 0}>
              {i18n.t('Update pin')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const BlockCardAction = (props: ActionProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const { mutate: mutateBlock, isLoading } = useMutation(CardEvents.Block, {
    successMessage: i18n.t('Successfully blocked the card.'),
    onSuccess: () => {
      setIsOpen(false);
      props.onSuccess?.();
    },
  });

  return (
    <>
      <Button
        class='w-full justify-start h-10 px-4 text-xs bg-[var(--gta-red)]/10 text-[var(--gta-red)] border border-[var(--gta-red)]/30 hover:bg-[var(--gta-red)]/20'
        onClick={() => setIsOpen(true)}
      >
        <ShieldAlert size={14} class='mr-2.5 opacity-70' />
        {i18n.t('Block card')}
      </Button>

      <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} title={i18n.t('Blocking card')} maxWidth='sm'>
        <div class='flex flex-col gap-5'>
          <Typography class='text-[var(--gta-text-muted)]'>
            {i18n.t('Are you sure you want to block this card? You can unlock it later from card actions.')}
          </Typography>
          <div class='flex justify-end gap-2 pt-3 border-t border-[var(--gta-border)]'>
            <Button variant='secondary' onClick={() => setIsOpen(false)}>
              {i18n.t('Cancel')}
            </Button>
            <Button
              variant='danger'
              onClick={() => mutateBlock({ cardId: props.cardId })}
              disabled={isLoading()}
            >
              {i18n.t('Block card')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const UnblockCardAction = (props: ActionProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const { mutate: mutateUnblock, isLoading } = useMutation(CardEvents.Unblock, {
    successMessage: i18n.t('Successfully unblocked the card.'),
    onSuccess: () => {
      setIsOpen(false);
      props.onSuccess?.();
    },
  });

  return (
    <>
      <Button class='w-full justify-start h-10 px-4 text-xs' onClick={() => setIsOpen(true)}>
        <ShieldCheck size={14} class='mr-2.5' />
        {i18n.t('Unlock card')}
      </Button>

      <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} title={i18n.t('Unlock card')} maxWidth='sm'>
        <div class='flex flex-col gap-5'>
          <Typography class='text-[var(--gta-text-muted)]'>
            {i18n.t('Are you sure you want to unlock this card? It will be usable again for transactions.')}
          </Typography>
          <div class='flex justify-end gap-2 pt-3 border-t border-[var(--gta-border)]'>
            <Button variant='secondary' onClick={() => setIsOpen(false)}>
              {i18n.t('Cancel')}
            </Button>
            <Button onClick={() => mutateUnblock({ cardId: props.cardId })} disabled={isLoading()}>
              {i18n.t('Unlock card')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const DeleteCardAction = (props: ActionProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const { mutate: mutateDelete, isLoading } = useMutation(CardEvents.Delete, {
    successMessage: i18n.t('Successfully deleted the card.'),
    onSuccess: () => {
      setIsOpen(false);
      props.onSuccess?.();
    },
  });

  return (
    <>
      <Button
        class='w-full justify-start h-10 px-4 text-xs bg-[var(--gta-red)]/10 text-[var(--gta-red)] border border-[var(--gta-red)]/30 hover:bg-[var(--gta-red)]/20 mt-1'
        onClick={() => setIsOpen(true)}
      >
        <Trash2 size={14} class='mr-2.5 opacity-70' />
        {i18n.t('Delete card')}
      </Button>

      <Modal isOpen={isOpen()} onClose={() => setIsOpen(false)} title={i18n.t('Deleting card')} maxWidth='sm'>
        <div class='flex flex-col gap-5'>
          <Typography class='text-[var(--gta-text-muted)]'>
            {i18n.t('Are you sure you want to delete this card? This action cannot be undone.')}
          </Typography>
          <div class='flex justify-end gap-2 pt-3 border-t border-[var(--gta-border)]'>
            <Button variant='secondary' onClick={() => setIsOpen(false)}>
              {i18n.t('Cancel')}
            </Button>
            <Button
              variant='danger'
              onClick={() => mutateDelete({ cardId: props.cardId })}
              disabled={isLoading()}
            >
              {i18n.t('Delete card')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

interface CardActionsProps {
  cardId: number;
  isBlocked?: boolean;
  onBlock?(): void;
  onUnblock?(): void;
  onDelete?(): void;
}

const CardActions = (props: CardActionsProps) => {
  return (
    <div class='flex flex-col gap-4 min-w-[200px]'>
      <div class='flex flex-col gap-1'>
        <Typography variant='h4' class='text-[var(--gta-text)] font-bold tracking-[0.1em] text-xs'>
          {i18n.t('Card Actions')}
        </Typography>
        <Typography variant='pre' class='text-[var(--gta-text-dim)]'>
          {i18n.t('Manage this card')}
        </Typography>
      </div>

      <div class='flex flex-col gap-1.5'>
        <UpdatePinAction cardId={props.cardId} />

        <Show when={props.isBlocked} fallback={
          <BlockCardAction cardId={props.cardId} onSuccess={props.onBlock} />
        }>
            <UnblockCardAction cardId={props.cardId} onSuccess={props.onUnblock} />
            <DeleteCardAction cardId={props.cardId} onSuccess={props.onDelete} />
        </Show>
      </div>
    </div>
  );
};

export default CardActions;
