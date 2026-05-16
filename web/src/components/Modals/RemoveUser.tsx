// web/src/components/Modals/RemoveUser.tsx
import UserSelect from "@components/UserSelect";
import Button from "@components/ui/Button";
import { Typography } from "@components/ui/Typography";
import { AccountRole, type SharedAccountUser } from "@typings/Account";
import { SharedAccountEvents } from "@typings/Events";
import type { OnlineUser } from "@typings/user";
import { fetchNui } from "@utils/fetchNui";
import { createSignal, createEffect, createMemo } from 'solid-js';
import i18n from "@utils/i18n";
import { Modal } from '../ui/Modal';

interface SelectUserModalProps {
  isOpen: boolean;
  onClose(): void;
  accountId: number;
  onSelect(identifier: string): void;
}

const RemoveUserModal = (props: SelectUserModalProps) => {
  const [selectedUserIdentifier, setSelectedUserIdentifier] = createSignal('');
  const [users, setUsers] = createSignal<SharedAccountUser[]>([]);

  const handleUserSelect = (user: OnlineUser) => {
    setSelectedUserIdentifier(user.identifier);
  };

  const handleSubmit = () => {
    props.onSelect(selectedUserIdentifier());
  };

  createEffect(() => {
    if (props.isOpen) {
      fetchNui<SharedAccountUser[]>(SharedAccountEvents.GetUsers, { accountId: props.accountId }).then((data) => setUsers(data ?? []));
    }
  });

  const filteredUsers = createMemo(() => users()
    .map((user) => ({
      name: user.name ?? '',
      identifier: user.userIdentifier,
      isDisabled: [AccountRole.Owner as AccountRole].includes(user.role),
    }))
    .filter((user) => !user.isDisabled));

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title={i18n.t('Revoke Access')} maxWidth='sm'>
      <div class='p-6 flex flex-col gap-6 h-full'>
        <div class='flex flex-col gap-1.5'>
          <Typography variant='label' class='text-white/60'>
            {i18n.t('Identify User')}
          </Typography>
          <UserSelect onSelect={handleUserSelect} users={filteredUsers()} />
        </div>

        <div class='flex justify-end gap-3 mt-auto pt-6 border-t border-white/5'>
          <Button variant='secondary' onClick={props.onClose}>
            {i18n.t('Cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedUserIdentifier()}
            class='bg-red-500 hover:bg-red-600 text-white'
          >
            {i18n.t('Revoke Access')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveUserModal;
