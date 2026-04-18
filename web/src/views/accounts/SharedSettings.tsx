import AddUserModal from '@components/Modals/AddUser';
import RemoveUserModal from '@components/Modals/RemoveUser';
import Button from '@components/ui/Button';
import { Typography } from '@components/ui/Typography';
import { accountsAtom } from '@data/accounts';
import type {
 AccountRole,
 AddToSharedAccountInput,
 RemoveFromSharedAccountInput,
 SharedAccountUser,
} from '@typings/Account';
import { SharedAccountEvents } from '@typings/Events';
import type { OnlineUser } from '@typings/user';
import { fetchNui } from '@utils/fetchNui';
import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@utils/cn';

interface Props {
 isAdmin: boolean;
 accountId: number;
}

const SharedSettings = ({ accountId, isAdmin }: Props) => {
 const { t } = useTranslation();
 const [, updateAccounts] = useAtom(accountsAtom);
 const [isAddUserOpen, setIsAddUserOpen] = useState(false);
 const [isRemoveUserOpen, setIsRemoveUserOpen] = useState(false);

 const [users, setUsers] = useState<SharedAccountUser[]>([]);

 const handleUpdateUsers = useCallback(() => {
 fetchNui<SharedAccountUser[]>(SharedAccountEvents.GetUsers, { accountId }).then((users) => setUsers(users ?? []));
 }, [accountId]);

 const handleUpdateAccounts = () => {
 updateAccounts();
 };

 useEffect(() => {
 handleUpdateUsers();
 }, [handleUpdateUsers]);

 const handleAddUserToAccount = (user: OnlineUser, role: AccountRole) => {
 const payload: AddToSharedAccountInput = {
 role,
 accountId,
 name: user.name,
 identifier: user.identifier,
 };

 fetchNui(SharedAccountEvents.AddUser, payload)
 .then(handleUpdateAccounts)
 .then(handleUpdateUsers)
 .finally(() => setIsAddUserOpen(false));
 };

 const handleRemoveUserFromAccount = (identifier: string) => {
 const payload: RemoveFromSharedAccountInput = {
 accountId,
 identifier,
 };

 fetchNui(SharedAccountEvents.RemoveUser, payload)
 .then(handleUpdateAccounts)
 .then(handleUpdateUsers)
 .finally(() => setIsRemoveUserOpen(false));
 };

 return (
 <>
 <AddUserModal
 users={users}
 isOpen={isAddUserOpen}
 onClose={() => setIsAddUserOpen(false)}
 onSelect={handleAddUserToAccount}
 />

 <RemoveUserModal
 accountId={accountId}
 isOpen={isRemoveUserOpen}
 onClose={() => setIsRemoveUserOpen(false)}
 onSelect={handleRemoveUserFromAccount}
 />

 <div className="flex flex-col gap-10">
 <div className="flex flex-col gap-4">
 <Typography variant="h3" className="text-white font-bold tracking-tight">
 {t('Account users')}
 </Typography>
 
 <div className="w-full rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-white/5 bg-white/[0.02]">
 <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
 {t('Name')}
 </th>
 <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
 {t('Role')}
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5">
 {users.map((user) => (
 <tr key={user.userIdentifier} className="hover:bg-white/[0.02] transition-colors group">
 <td className="px-5 py-4 text-sm font-medium text-white">
 {user.name ?? t('owner')}
 </td>
 <td className="px-5 py-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
 {t(user.role)}
 </td>
 </tr>
 ))}
 {users.length === 0 && (
 <tr>
 <td colSpan={2} className="px-5 py-8 text-center text-sm text-slate-600 italic">
 {t('No users added to this account')}
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 <div className="flex flex-col gap-4">
 <Typography variant="h3" className="text-white font-bold tracking-tight">
 {t('Shared account actions')}
 </Typography>
 <div className="flex flex-wrap gap-4">
 <Button 
 variant="secondary"
 onClick={() => setIsAddUserOpen(true)} 
 disabled={!isAdmin}
 >
 {t('Add user to account')}
 </Button>

 <Button 
 className="bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
 onClick={() => setIsRemoveUserOpen(true)} 
 disabled={!isAdmin}
 >
 {t('Remove user from account')}
 </Button>
 </div>
 </div>
 </div>
 </>
 );
};

export default SharedSettings;
