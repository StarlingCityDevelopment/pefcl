import Button from '@components/ui/Button';
import { Typography } from '@components/ui/Typography';
import { Modal } from '@components/ui/Modal';
import { useMutation } from '@hooks/useMutation';
import { AlertCircle, ShieldAlert, ShieldX, Key, Trash2, ShieldCheck } from 'lucide-react';
import { CardEvents } from '@typings/Events';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

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
      <Button
        className="w-full justify-start h-11 px-4"
        variant="secondary"
        onClick={() => setIsOpen(true)}
      >
        <Key className="w-4 h-4 mr-2.5 opacity-50" />
        {t('Update pin')}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Update pin')} maxWidth="sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Typography variant="pre" className="text-slate-500 font-bold ml-1">
                {t('New pin')}
              </Typography>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-2xl tracking-[0.5em] font-bold text-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-center"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Typography variant="pre" className="text-slate-500 font-bold ml-1">
                {t('Confirm new pin')}
              </Typography>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value)}
                className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-2xl tracking-[0.5em] font-bold text-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-center"
              />
            </div>

            {confirmNewPin !== newPin && confirmNewPin.length > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <Typography className="text-sm font-bold">{t('Pins do not match')}</Typography>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
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
        className="w-full justify-start h-11 px-4 bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
        onClick={() => setIsOpen(true)}
      >
        <ShieldAlert className="w-4 h-4 mr-2.5 opacity-70" />
        {t('Block card')}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Blocking card')} maxWidth="sm">
        <div className="flex flex-col gap-6">
          <Typography className="text-slate-400">
            {t('Are you sure you want to block this card? You can unlock it later from card actions.')}
          </Typography>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button 
              className="bg-rose-500 text-white hover:bg-rose-600 border-none"
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
      <Button className="w-full justify-start h-11 px-4" onClick={() => setIsOpen(true)}>
        <ShieldCheck className="w-4 h-4 mr-2.5" />
        {t('Unlock card')}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Unlock card')} maxWidth="sm">
        <div className="flex flex-col gap-6">
          <Typography className="text-slate-400">
            {t('Are you sure you want to unlock this card? It will be usable again for transactions.')}
          </Typography>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
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
        className="w-full justify-start h-11 px-4 bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 mt-2"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="w-4 h-4 mr-2.5 opacity-70" />
        {t('Delete card')}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('Deleting card')} maxWidth="sm">
        <div className="flex flex-col gap-6">
          <Typography className="text-slate-400">
            {t('Are you sure you want to delete this card? This action cannot be undone.')}
          </Typography>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button 
              className="bg-rose-500 text-white hover:bg-rose-600 border-none"
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
    <div className="flex flex-col gap-6 min-w-[200px]">
      <div className="flex flex-col gap-1">
        <Typography variant="h3" className="text-white font-bold tracking-tight">
          {t('Card Actions')}
        </Typography>
        <Typography variant="pre" className="text-slate-500 font-bold">
          {t('Manage this card')}
        </Typography>
      </div>

      <div className="flex flex-col gap-2">
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
