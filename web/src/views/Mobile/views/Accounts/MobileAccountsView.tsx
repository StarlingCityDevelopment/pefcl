// web/src/views/Mobile/views/Accounts/MobileAccountsView.tsx
import { AccountCard } from "@components/AccountCard";
import TotalBalance from "@components/TotalBalance";
import { Typography } from "@components/ui/Typography";
import { accounts } from "@data/accounts";
import { For, Show } from 'solid-js';
import i18n from "@utils/i18n";

const MobileAccountsView = () => {
  return (
    <div class='p-6 pb-24 flex flex-col gap-10'>
      <div class='flex flex-col gap-2'>
        <Typography variant='h2' class='text-[2rem] leading-none mb-2 italic uppercase'>
          {i18n.t('Accounts')}
        </Typography>
        <TotalBalance />
      </div>

      <div class='flex flex-col gap-5'>
        <For each={accounts()}>
            {(account) => <AccountCard account={account} />}
        </For>
      </div>

      <Show when={accounts().length <= 1}>
        <div class='p-8 text-center rounded-[2.5rem] bg-white/[0.02] border border-white/5 border-dashed'>
          <Typography class='text-white/40 leading-relaxed font-medium text-sm'>
            {i18n.t('You can create more accounts by visiting the nearest bank.')}
          </Typography>
        </div>
      </Show>
    </div>
  );
};

export default MobileAccountsView;
