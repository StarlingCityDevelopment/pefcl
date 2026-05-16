// web/src/views/accounts/SharedSettings.tsx
import AddUserModal from "@components/Modals/AddUser";
import RemoveUserModal from "@components/Modals/RemoveUser";
import Button from "@components/ui/Button";
import { Typography } from "@components/ui/Typography";
import { refetchAccounts } from "@data/accounts";
import type {
  AccountRole,
  AddToSharedAccountInput,
  RemoveFromSharedAccountInput,
  SharedAccountUser,
} from '@typings/Account';
import { SharedAccountEvents } from "@typings/Events";
import type { OnlineUser } from "@typings/user";
import { cn } from "@utils/cn";
import { fetchNui } from "@utils/fetchNui";
import { createSignal, createEffect, onMount, For, Show } from 'solid-js';
import i18n from "@utils/i18n";

interface Props {
  isAdmin: boolean;
  accountId: number;
}

const SharedSettings = (props: Props) => {
  const [isAddUserOpen, setIsAddUserOpen] = createSignal(false);
  const [isRemoveUserOpen, setIsRemoveUserOpen] = createSignal(false);
  const [users, setUsers] = createSignal<SharedAccountUser[]>([]);

  const handleUpdateUsers = () => {
    fetchNui<SharedAccountUser[]>(SharedAccountEvents.GetUsers, { accountId: props.accountId }).then((data) => setUsers(data ?? []));
  };

  createEffect(() => {
    handleUpdateUsers();
  });

  const handleAddUserToAccount = (user: OnlineUser, role: AccountRole) => {
    const payload: AddToSharedAccountInput = {
      role,
      accountId: props.accountId,
      name: user.name,
      identifier: user.identifier,
    };

    fetchNui(SharedAccountEvents.AddUser, payload)
      .then(() => refetchAccounts())
      .then(() => handleUpdateUsers())
      .finally(() => setIsAddUserOpen(false));
  };

  const handleRemoveUserFromAccount = (identifier: string) => {
    const payload: RemoveFromSharedAccountInput = {
      accountId: props.accountId,
      identifier,
    };

    fetchNui(SharedAccountEvents.RemoveUser, payload)
      .then(() => refetchAccounts())
      .then(() => handleUpdateUsers())
      .finally(() => setIsRemoveUserOpen(false));
  };

  return (
    <>
      <AddUserModal
        users={users()}
        isOpen={isAddUserOpen()}
        onClose={() => setIsAddUserOpen(false)}
        onSelect={handleAddUserToAccount}
      />

      <RemoveUserModal
        accountId={props.accountId}
        isOpen={isRemoveUserOpen()}
        onClose={() => setIsRemoveUserOpen(false)}
        onSelect={handleRemoveUserFromAccount}
      />

      <div class='flex flex-col gap-10'>
        <div class='flex flex-col gap-4'>
          <Typography variant='h3' class='text-white font-bold tracking-tight'>
            {i18n.t('Account users')}
          </Typography>

          <div class='w-full rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden'>
            <div class='overflow-x-auto'>
              <table class='w-full text-left border-collapse'>
                <thead>
                  <tr class='border-b border-white/5 bg-white/[0.02]'>
                    <th class='px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500'>
                      {i18n.t('Name')}
                    </th>
                    <th class='px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500'>
                      {i18n.t('Role')}
                    </th>
                  </tr>
                </thead>
                <tbody class='divide-y divide-white/5'>
                  <For each={users()} fallback={
                    <tr>
                      <td colSpan={2} class='px-5 py-8 text-center text-sm text-slate-600 italic'>
                        {i18n.t('No users added to this account')}
                      </td>
                    </tr>
                  }>
                    {(user) => (
                      <tr class='hover:bg-white/[0.02] transition-colors group'>
                        <td class='px-5 py-4 text-sm font-medium text-white'>{user.name ?? i18n.t('owner')}</td>
                        <td class='px-5 py-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors'>
                          {i18n.t(user.role)}
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class='flex flex-col gap-4'>
          <Typography variant='h3' class='text-white font-bold tracking-tight'>
            {i18n.t('Shared account actions')}
          </Typography>
          <div class='flex flex-wrap gap-4'>
            <Button variant='secondary' onClick={() => setIsAddUserOpen(true)} disabled={!props.isAdmin}>
              {i18n.t('Add user to account')}
            </Button>

            <Button
              class='bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20'
              onClick={() => setIsRemoveUserOpen(true)}
              disabled={!props.isAdmin}
            >
              {i18n.t('Remove user from account')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SharedSettings;
