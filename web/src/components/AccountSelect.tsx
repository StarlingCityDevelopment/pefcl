// web/src/components/AccountSelect.tsx
import { type Account, AccountRole, AccountType, type ExternalAccount } from "@typings/Account";
import { cn } from "@utils/cn";
import { createSignal, createMemo, Show, Suspense, For } from 'solid-js';
import i18n from "@utils/i18n";
import { useConfig } from "@hooks/useConfig";
import { formatMoney } from "@utils/currency";
import AddExternalAccountModal from './Modals/AddExternalAccount';
import Button from './ui/Button';
import Select from './ui/Select';
import { Typography } from './ui/Typography';

const EXT_PREFIX = 'ext-';

interface AccountSelectProps {
  accounts: Account[];
  selectedId?: number;
  excludeId?: number;
  isFromAccount?: boolean;
  isExternalSelected?: boolean;
  externalAccounts?: ExternalAccount[];
  onSelect(accountId: number, isExternal?: boolean): void;
}

type SnapshotProps =
  | { type: 'external'; account: ExternalAccount }
  | { type: 'internal'; account: Account };

const AccountSelectSnapshot = (props: SnapshotProps) => {
  const config = useConfig();

  return (
    <div class='flex flex-col text-left py-0.5 overflow-hidden pr-2'>
      <Show when={props.type === 'external'} fallback={
        <div class='flex flex-col text-left py-0.5 overflow-hidden pr-2'>
          <div class='flex items-center gap-2 mb-1'>
            <Typography class='text-sm font-medium text-(--gta-text) truncate'>
              {(props as any).account.accountName}
            </Typography>
            <div class='flex items-center justify-center px-2 py-0.5 bg-(--gta-surface) border border-(--gta-border) shrink-0'>
              <Typography variant='pre' class='text-[8px] text-(--gta-text-dim) uppercase tracking-[0.15em]'>
                {(props as any).account.type === AccountType.Personal ? i18n.t('Personal') : i18n.t('Shared')}
              </Typography>
            </div>
          </div>
          <Typography class='text-sm text-(--gta-green)'>
            {formatMoney((props as any).account.balance, config()?.general)}
          </Typography>
        </div>
      }>
        <div class='flex flex-col text-left py-0.5 overflow-hidden pr-2'>
          <Typography class='text-sm font-medium text-(--gta-text) truncate mb-1'>
            {(props as any).account.name}
          </Typography>
          <Typography variant='pre' class='text-[10px] text-(--gta-text-dim) font-medium'>
            {(props as any).account.number}
          </Typography>
        </div>
      </Show>
    </div>
  );
};

const AccountSelect = (props: AccountSelectProps) => {
  const [isExternalOpen, setIsExternalOpen] = createSignal(false);

  const options = createMemo(() => {
    const opts: { value: string | number; label: JSX.Element }[] = [];

    // Internal Accounts
    props.accounts
      .filter((account) => account.id !== props.excludeId)
      .forEach((account) => {
        const isDisabledByContributor = props.isFromAccount && account.role === AccountRole.Contributor;
        opts.push({
          value: account.id.toString(),
          label: (
            <div class={cn('flex flex-col w-full', isDisabledByContributor && 'opacity-30 grayscale')}>
              <AccountSelectSnapshot account={account} type='internal' />
              <Show when={isDisabledByContributor}>
                <Typography variant='pre' class='text-[9px] text-[var(--gta-text-dim)] mt-2 font-bold leading-tight uppercase tracking-[0.1em]'>
                  {i18n.t('Restricted: Contributors cannot move shared funds')}
                </Typography>
              </Show>
            </div>
          ),
        });
      });

    // External Accounts
    (props.externalAccounts || []).forEach((account) => {
      opts.push({
        value: `${EXT_PREFIX}${account.id}`,
        label: <AccountSelectSnapshot account={account} type='external' />,
      });
    });

    return opts;
  });

  const currentValue = () =>
    props.selectedId === undefined || props.selectedId === 0
      ? '0'
      : props.isExternalSelected
        ? `${EXT_PREFIX}${props.selectedId}`
        : props.selectedId.toString();

  const handleChange = (event: { target: { value: string | number } }) => {
    const val = event.target.value.toString();
    if (val === '0') return;

    if (val.startsWith(EXT_PREFIX)) {
      const extId = Number(val.slice(EXT_PREFIX.length));
      if (!isNaN(extId)) {
        props.onSelect(extId, true);
      }
    } else {
      const numericValue = Number(val);
      if (!isNaN(numericValue)) {
        props.onSelect(numericValue, false);
      }
    }
  };

  return (
    <div class='w-full'>
      <AddExternalAccountModal isOpen={isExternalOpen()} onClose={() => setIsExternalOpen(false)} />
      <div class='flex flex-col gap-2'>
        <Select
          value={currentValue()}
          onChange={handleChange}
          options={options()}
          placeholder={i18n.t('Select account')}
          renderValue={(val) => {
            const stringVal = (val || '').toString();
            if (stringVal === '0')
              return (
                <Typography variant='label' class='text-[var(--gta-text-dim)]'>
                  {i18n.t('Select account')}
                </Typography>
              );

            if (stringVal.startsWith(EXT_PREFIX)) {
              const extId = stringVal.slice(EXT_PREFIX.length);
              const external = (props.externalAccounts || []).find((a) => a.id.toString() === extId);
              if (external) return <AccountSelectSnapshot account={external} type='external' />;
            } else {
              const account = props.accounts.find((a) => a.id.toString() === stringVal);
              if (account) return <AccountSelectSnapshot account={account} type='internal' />;
            }
            return (
              <Typography variant='label' class='text-[var(--gta-text-dim)]'>
                {i18n.t('Select account')}
              </Typography>
            );
          }}
        />
        <Show when={!props.isFromAccount}>
          <Button
            variant='secondary'
            onClick={() => setIsExternalOpen(true)}
            class='h-8 text-[9px] font-bold uppercase tracking-[0.15em] px-4 self-start'
          >
            + {i18n.t('Register Outside Entity')}
          </Button>
        </Show>
      </div>
    </div>
  );
};

export default AccountSelect;
