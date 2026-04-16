import React, { useState } from 'react';
import Button from '@components/ui/Button';
import {
  Alert,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { Heading4 } from '@components/ui/Typography/Headings';
import { PreHeading } from '@components/ui/Typography/BodyText';
import { useTranslation } from 'react-i18next';
import BaseDialog from '@components/Modals/BaseDialog';
import { CardEvents } from '@typings/Events';
import { ErrorRounded } from '@mui/icons-material';
import PinField from '@components/ui/Fields/PinField';
import { useMutation } from '@hooks/useMutation';

interface CardActionsProps {
  cardId: number;
  isBlocked?: boolean;
  onBlock?(): void;
  onUnblock?(): void;
  onDelete?(): void;
}

const CardActions = ({ cardId, onBlock, onUnblock, onDelete, isBlocked }: CardActionsProps) => {
  const [dialog, setDialog] = useState<'none' | 'block' | 'unblock' | 'update' | 'delete'>('none');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const { t } = useTranslation();

  const handleClose = () => {
    setDialog('none');
    setNewPin('');
    setConfirmNewPin('');
  };

  const { mutate: mutateBlock, isLoading: isBlocking } = useMutation(CardEvents.Block, {
    successMessage: t('Successfully blocked the card.'),
    onSuccess: () => {
      handleClose();
      onBlock?.();
    },
  });

  const { mutate: mutateUnblock, isLoading: isUnblocking } = useMutation(CardEvents.Unblock, {
    successMessage: t('Successfully unblocked the card.'),
    onSuccess: () => {
      handleClose();
      onUnblock?.();
    },
  });

  const { mutate: mutateDelete, isLoading: isDeleting } = useMutation(CardEvents.Delete, {
    successMessage: t('Successfully deleted the card.'),
    onSuccess: () => {
      handleClose();
      onDelete?.();
    },
  });

  const { mutate: mutateUpdatePin, isLoading: isUpdatingPin } = useMutation(CardEvents.UpdatePin, {
    successMessage: t('Successfully updated pin.'),
    onSuccess: handleClose,
  });

  const isLoading = isBlocking || isUnblocking || isDeleting || isUpdatingPin;

  const handleBlockCard = () => mutateBlock({ cardId });
  const handleUnblockCard = () => mutateUnblock({ cardId });
  const handleDeleteCard = () => mutateDelete({ cardId });

  const handleUpdatePin = async () => {
    if (confirmNewPin !== newPin) {
      return;
    }
    await mutateUpdatePin({ cardId, newPin: parseInt(newPin, 10) });
  };

  return (
    <>
      <Stack spacing={2.5} sx={{ minWidth: '200px' }}>
        <Stack spacing={0.5}>
          <Heading4>{t('Card Actions')}</Heading4>
          <PreHeading>{t('Manage this card')}</PreHeading>
        </Stack>

        <Stack spacing={0.75}>
          <Button
            fullWidth
            size="small"
            onClick={() => !isBlocked && setDialog('update')}
            disabled={isLoading || isBlocked}
          >
            {t('Update pin')}
          </Button>

          {isBlocked ? (
            <>
              <Button
                fullWidth
                size="small"
                onClick={() => setDialog('unblock')}
                disabled={isLoading}
              >
                {t('Unlock card')}
              </Button>

              <Button
                fullWidth
                size="small"
                color="error"
                onClick={() => setDialog('delete')}
                disabled={isLoading}
              >
                {t('Delete card')}
              </Button>
            </>
          ) : (
            <Button
              fullWidth
              size="small"
              color="error"
              onClick={() => setDialog('block')}
              disabled={isLoading}
            >
              {t('Block card')}
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Update PIN dialog */}
      <BaseDialog open={dialog === 'update'} onClose={handleClose}>
        <DialogTitle>{t('Update pin')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <PinField
                label={t('New pin')}
                value={newPin}
                onChange={(event) => setNewPin(event.target.value)}
              />
              <PinField
                value={confirmNewPin}
                label={t('Confirm new pin')}
                onChange={(event) => setConfirmNewPin(event.target.value)}
              />
              {confirmNewPin !== newPin && confirmNewPin.length > 0 && (
                <Alert icon={<ErrorRounded />} color="error">
                  {t('Pins do not match')}
                </Alert>
              )}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleUpdatePin} disabled={isLoading}>
            {t('Update pin')}
          </Button>
        </DialogActions>
      </BaseDialog>

      {/* Block card dialog */}
      <BaseDialog open={dialog === 'block'} onClose={handleClose}>
        <DialogTitle>{t('Blocking card')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              'Are you sure you want to block this card? You can unlock it later from card actions.',
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button color="error" onClick={handleBlockCard} disabled={isLoading}>
            {t('Block card')}
          </Button>
        </DialogActions>
      </BaseDialog>

      {/* Unblock card dialog */}
      <BaseDialog open={dialog === 'unblock'} onClose={handleClose}>
        <DialogTitle>{t('Unlock card')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              'Are you sure you want to unlock this card? It will be usable again for transactions.',
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleUnblockCard} disabled={isLoading}>
            {t('Unlock card')}
          </Button>
        </DialogActions>
      </BaseDialog>

      {/* Delete card dialog */}
      <BaseDialog open={dialog === 'delete'} onClose={handleClose}>
        <DialogTitle>{t('Deleting card')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('Are you sure you want to delete this card? This action cannot be undone.')}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {t('Cancel')}
          </Button>
          <Button color="error" onClick={handleDeleteCard} disabled={isLoading}>
            {t('Delete card')}
          </Button>
        </DialogActions>
      </BaseDialog>
    </>
  );
};

export default CardActions;
