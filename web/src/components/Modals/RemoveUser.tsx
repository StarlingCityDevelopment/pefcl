import UserSelect from '@components/UserSelect';
import Button from '@components/ui/Button';
import { Typography } from '@components/ui/Typography';
import { AccountRole, type SharedAccountUser } from '@typings/Account';
import { SharedAccountEvents } from '@typings/Events';
import type { OnlineUser } from '@typings/user';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseDialog from './BaseDialog';

interface SelectUserModalProps {
  isOpen: boolean;
  onClose(): void;
  accountId: number;
  onSelect(identifier: string): void;
}

const RemoveUserModal = ({ isOpen, onSelect, onClose, accountId }: SelectUserModalProps) => {
  const { t } = useTranslation();
  const [selectedUserIdentifier, setSelectedUserIdentifier] = useState('');
  const [users, setUsers] = useState<SharedAccountUser[]>([]);

  const handleUserSelect = (user: OnlineUser) => {
    setSelectedUserIdentifier(user.identifier);
  };

  const handleSubmit = () => {
    onSelect(selectedUserIdentifier);
  };

  useEffect(() => {
    if (isOpen) {
      fetchNui<SharedAccountUser[]>(SharedAccountEvents.GetUsers, { accountId }).then((users) => setUsers(users ?? []));
    }
  }, [accountId, isOpen]);

  const filteredUsers = users
    .map((user) => ({
      name: user.name ?? '',
      identifier: user.userIdentifier,
      isDisabled: [AccountRole.Owner as AccountRole].includes(user.role),
    }))
    .filter((user) => !user.isDisabled);

  return (
    <BaseDialog open={isOpen} onClose={onClose} maxWidth="500px">
      <div className="p-6 flex flex-col gap-6 h-full">
        <Typography variant="h3" className="text-lg font-medium leading-none tracking-tight">
          {t('Revoke Access')}
        </Typography>

        <div className="flex flex-col gap-1.5">
          <Typography variant="label" className="text-white/60">
            {t('Identify User')}
          </Typography>
          <UserSelect onSelect={handleUserSelect} users={filteredUsers} />
        </div>

        <div className="flex justify-end gap-3 mt-auto pt-6 border-t border-white/5">
          <Button variant="secondary" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedUserIdentifier} className="bg-red-500 hover:bg-red-600 text-white">
            {t('Revoke Access')}
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
};

export default RemoveUserModal;

