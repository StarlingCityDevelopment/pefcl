import Button from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Typography } from '@components/ui/Typography';
import { useMutation } from '@hooks/useMutation';
import { CardEvents } from '@typings/Events';
import { cn } from '@utils/cn';
import { AlertCircle, Key, ShieldAlert, ShieldCheck, ShieldX, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ActionProps {
  cardId: number;
  onSuccess?: () => void;
  isLoading?: boolean;
}

const UpdatePinAction = ({ cardId, onSuccess }: ActionProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  const { mutate: mutateUpdatePin, isLoading } = useMutation(CardEvents.UpdatePin, {
    successMessage: t('Successfully updated pin.'),
    onSuccess: () => {
      setIsOpen(false);
      setNewPin('');
      setConfirmNewPin('');
      onSuccess?.();
    },
  });

  const handleUpdatePin = async () => {
    if (confirmNewPin !== newPin) return;
    await mutateUpdatePin({ cardId, newPin: Number.parseInt(newPin, 10) });
  };

  return (
    <>
      <Button className='w-full justify-start h-10 px-4 text-xs' variant='secondary' onClick={() => setIsOpen(true)}>
        <Key className='w-3.5 h-3.5 mr-2.5 opacity-50' />
        {t('Update pin')}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Update pin')} maxWidth='sm'>
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Typography variant='pre' className='text-[var(--gta-text-dim)] font-bold ml-0.5'>
                {t('New pin')}
              </Typography>
              <input
                type='password'
                maxLength={4}
                placeholder='••••'
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className='w-full h-12 bg-[var(--gta-surface)] border border-[var(--gta-border)] px-6 text-xl tracking-[0.5em] font-bold text-[var(--gta-text)] focus:outline-none focus:border-[var(--gta-green)] focus:shadow-[0_0_8px_var(--gta-green-glow)] transition-all text-center placeholder:text-[var(--gta-text-dim)]'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <Typography variant='pre' className='text-[var(--gta-text-dim)] font-bold ml-0.5'>
                {t('Confirm new pin')}
              </Typography>
              <input
                type='password'
                maxLength={4}
                placeholder='••••'
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value)}
                className='w-full h-12 bg-[var(--gta-surface)] border border-[var(--gta-border)] px-6 text-xl tracking-[0.5em] font-bold text-[var(--gta-text)] focus:outline-none focus:border-[var(--gta-green)] focus:shadow-[0_0_8px_var(--gta-green-glow)] transition-all text-center placeholder:text-[var(--gta-text-dim)]'
              />
            </div>

            {confirmNewPin !== newPin && confirmNewPin.length > 0 && (
              <div className='flex items-center gap-3 p-3 bg-[var(--gta-red)]/10 border border-[var(--gta-red)]/30'>
                <AlertCircle className='w-4 h-4 shrink-0 text-[var(--gta-red)]' />
                <Typography className='text-xs font-bold text-[var(--gta-red)]'>{t('Pins do not match')}</Typography>
              </div>
            )}
          </div>

          <div className='flex justify-end gap-2 pt-3 border-t border-[var(--gta-border)]'>
            <Button variant='secondary' onClick={() => setIsOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button onClick={handleUpdatePin} disabled={isLoading || confirmNewPin !== newPin || newPin.length === 0}>
              {t('Update pin')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const BlockCardAction = ({ cardId, onSuccess }: ActionProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: mutateBlock, isLoading } = useMutation(CardEvents.Block, {
    successMessage: t('Successfully blocked the card.'),
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
  });

  return (
    <>
      <Button
        className='w-full justify-start h-10 px-4 text-xs bg-[var(--gta-red)]/10 text-[var(--gta-red)] border border-[var(--gta-red)]/30 hover:bg-[var(--gta-red)]/20'
        onClick={() => setIsOpen(true)}
      >
        <ShieldAlert className='w-3.5 h-3.5 mr-2.5 opacity-70' />
        {t('Block card')}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Blocking card')} maxWidth='sm'>
        <div className='flex flex-col gap-5'>
          <Typography className='text-[var(--gta-text-muted)]'>
            {t('Are you sure you want to block this card? You can unlock it later from card actions.')}
          </Typography>
          <div className='flex justify-end gap-2 pt-3 border-t border-[var(--gta-border)]'>
            <Button variant='secondary' onClick={() => setIsOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button
              variant='danger'
              onClick={() => mutateBlock({ cardId })}
              disabled={isLoading}
            >
              {t('Block card')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const UnblockCardAction = ({ cardId, onSuccess }: ActionProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: mutateUnblock, isLoading } = useMutation(CardEvents.Unblock, {
    successMessage: t('Successfully unblocked the card.'),
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
  });

  return (
    <>
      <Button className='w-full justify-start h-10 px-4 text-xs' onClick={() => setIsOpen(true)}>
        <ShieldCheck className='w-3.5 h-3.5 mr-2.5' />
        {t('Unlock card')}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Unlock card')} maxWidth='sm'>
        <div className='flex flex-col gap-5'>
          <Typography className='text-[var(--gta-text-muted)]'>
            {t('Are you sure you want to unlock this card? It will be usable again for transactions.')}
          </Typography>
          <div className='flex justify-end gap-2 pt-3 border-t border-[var(--gta-border)]'>
            <Button variant='secondary' onClick={() => setIsOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button onClick={() => mutateUnblock({ cardId })} disabled={isLoading}>
              {t('Unlock card')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const DeleteCardAction = ({ cardId, onSuccess }: ActionProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: mutateDelete, isLoading } = useMutation(CardEvents.Delete, {
    successMessage: t('Successfully deleted the card.'),
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
  });

  return (
    <>
      <Button
        className='w-full justify-start h-10 px-4 text-xs bg-[var(--gta-red)]/10 text-[var(--gta-red)] border border-[var(--gta-red)]/30 hover:bg-[var(--gta-red)]/20 mt-1'
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className='w-3.5 h-3.5 mr-2.5 opacity-70' />
        {t('Delete card')}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Deleting card')} maxWidth='sm'>
        <div className='flex flex-col gap-5'>
          <Typography className='text-[var(--gta-text-muted)]'>
            {t('Are you sure you want to delete this card? This action cannot be undone.')}
          </Typography>
          <div className='flex justify-end gap-2 pt-3 border-t border-[var(--gta-border)]'>
            <Button variant='secondary' onClick={() => setIsOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button
              variant='danger'
              onClick={() => mutateDelete({ cardId })}
              disabled={isLoading}
            >
              {t('Delete card')}
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

const CardActions = ({ cardId, onBlock, onUnblock, onDelete, isBlocked }: CardActionsProps) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-4 min-w-[200px]'>
      <div className='flex flex-col gap-1'>
        <Typography variant='h4' className='text-[var(--gta-text)] font-bold tracking-[0.1em] text-xs'>
          {t('Card Actions')}
        </Typography>
        <Typography variant='pre' className='text-[var(--gta-text-dim)]'>
          {t('Manage this card')}
        </Typography>
      </div>

      <div className='flex flex-col gap-1.5'>
        <UpdatePinAction cardId={cardId} />

        {isBlocked ? (
          <>
            <UnblockCardAction cardId={cardId} onSuccess={onUnblock} />
            <DeleteCardAction cardId={cardId} onSuccess={onDelete} />
          </>
        ) : (
          <BlockCardAction cardId={cardId} onSuccess={onBlock} />
        )}
      </div>
    </div>
  );
};

export default CardActions;
