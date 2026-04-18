import UserSelect from '@components/UserSelect';
import Button from '@components/ui/Button';
import Select from '@components/ui/Select';
import { Typography } from '@components/ui/Typography';
import { AccountRole, type SharedAccountUser } from '@typings/Account';
import { UserEvents } from '@typings/Events';
import type { OnlineUser } from '@typings/user';
import { fetchNui } from '@utils/fetchNui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseDialog from './BaseDialog';

interface SelectUserModalProps {
  users: SharedAccountUser[];
  isOpen: boolean;
  onClose(): void;
  onSelect(user: OnlineUser, role: AccountRole): void;
}

const AddUserModal = ({ isOpen, onSelect, onClose, users: existingUsers }: SelectUserModalProps) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState(AccountRole.Contributor);

  useEffect(() => {
    fetchNui<OnlineUser[]>(UserEvents.GetUsers).then((data) => data && setUsers(data));
  }, []);

  const handleUserSelect = (user: OnlineUser) => {
    setSelectedUserId(user.identifier);
  };

  const handleSubmit = () => {
    const user = users.find((user) => user.identifier === selectedUserId);
    user && onSelect(user, selectedRole);
  };

  const filteredUsers = users.filter((user) => {
    const exists = existingUsers.find((existingUser) => existingUser.userIdentifier === user.identifier);
    return !exists;
  });

  return (
    <BaseDialog open={isOpen} onClose={onClose} maxWidth="500px">
      <div className="p-6 flex flex-col gap-6 h-full">
        <Typography variant="h3" className="text-lg font-medium leading-none tracking-tight">
          {t('Delegate Access')}
        </Typography>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Typography variant="label" className="text-white/60">
              {t('Identify User')}
            </Typography>
            <UserSelect onSelect={handleUserSelect} users={filteredUsers} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Typography variant="label" className="text-white/60">
              {t('Set Permissions')}
            </Typography>
            <Select 
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value as AccountRole)}
              options={[
                { value: AccountRole.Admin, label: t('Administrator') },
                { value: AccountRole.Contributor, label: t('Contributor') }
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-auto pt-6 border-t border-white/5">
          <Button variant="secondary" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedUserId}>
            {t('Grant Access')}
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
};

export default AddUserModal;

