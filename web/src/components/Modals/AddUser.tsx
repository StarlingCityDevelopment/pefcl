// web/src/components/Modals/AddUser.tsx
import UserSelect from "@components/UserSelect";
import Button from "@components/ui/Button";
import Select from "@components/ui/Select";
import { Typography } from "@components/ui/Typography";
import { AccountRole, type SharedAccountUser } from "@typings/Account";
import { UserEvents } from "@typings/Events";
import type { OnlineUser } from "@typings/user";
import { fetchNui } from "@utils/fetchNui";
import { createSignal, onMount, createMemo } from 'solid-js';
import i18n from "@utils/i18n";
import { Modal } from '../ui/Modal';

interface SelectUserModalProps {
  users: SharedAccountUser[];
  isOpen: boolean;
  onClose(): void;
  onSelect(user: OnlineUser, role: AccountRole): void;
}

const AddUserModal = (props: SelectUserModalProps) => {
  const [users, setUsers] = createSignal<OnlineUser[]>([]);
  const [selectedUserId, setSelectedUserId] = createSignal('');
  const [selectedRole, setSelectedRole] = createSignal(AccountRole.Contributor);

  onMount(() => {
    fetchNui<OnlineUser[]>(UserEvents.GetUsers).then((data) => data && setUsers(data));
  });

  const handleUserSelect = (user: OnlineUser) => {
    setSelectedUserId(user.identifier);
  };

  const handleSubmit = () => {
    const user = users().find((u) => u.identifier === selectedUserId());
    user && props.onSelect(user, selectedRole());
  };

  const filteredUsers = createMemo(() => users().filter((user) => {
    const exists = props.users.find((existingUser) => existingUser.userIdentifier === user.identifier);
    return !exists;
  }));

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title={i18n.t('Delegate Access')} maxWidth='sm'>
      <div class='flex flex-col gap-6 h-full'>
        <div class='flex flex-col gap-4'>
          <div class='flex flex-col gap-1.5'>
            <Typography variant='label' class='text-white/60'>
              {i18n.t('Identify User')}
            </Typography>
            <UserSelect onSelect={handleUserSelect} users={filteredUsers()} />
          </div>

          <div class='flex flex-col gap-1.5'>
            <Typography variant='label' class='text-white/60'>
              {i18n.t('Set Permissions')}
            </Typography>
            <Select
              value={selectedRole()}
              onChange={(event) => setSelectedRole(event.target.value as AccountRole)}
              options={[
                { value: AccountRole.Admin, label: i18n.t('Administrator') },
                { value: AccountRole.Contributor, label: i18n.t('Contributor') },
              ]}
            />
          </div>
        </div>

        <div class='flex justify-end gap-3 mt-auto pt-6 border-t border-white/5'>
          <Button variant='secondary' onClick={props.onClose}>
            {i18n.t('Cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedUserId()}>
            {i18n.t('Grant Access')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;
