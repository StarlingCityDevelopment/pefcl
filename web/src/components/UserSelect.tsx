// web/src/components/UserSelect.tsx
import type { User } from "@typings/user";
import { Search, User as UserIcon } from 'lucide-solid';
import { createSignal, createMemo, onMount, onCleanup, For, Show } from 'solid-js';
import i18n from "@utils/i18n";
import TextField from './ui/Fields/TextField';
import { Typography } from './ui/Typography';

interface SelectableUser extends User {
  isDisabled?: boolean;
}

interface UserSelectProps {
  users: SelectableUser[];
  isDisabled?: boolean;
  selectedId?: string;
  onSelect(user?: SelectableUser): void;
}

const UserSelect = (props: UserSelectProps) => {
  const [query, setQuery] = createSignal('');
  const [isOpen, setIsOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined;

  const filteredUsers = createMemo(() => {
    const currentQuery = query();
    if (!currentQuery) return props.users;
    return props.users.filter(
      (user) =>
        user.name.toLowerCase().includes(currentQuery.toLowerCase()) ||
        user.identifier.toLowerCase().includes(currentQuery.toLowerCase()),
    );
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef && !containerRef.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
    onCleanup(() => document.removeEventListener('mousedown', handleClickOutside));
  });

  const handleSelect = (user: SelectableUser) => {
    setQuery(user.name);
    setIsOpen(false);
    props.onSelect(user);
  };

  return (
    <div class='relative w-full' ref={containerRef}>
      <div class='relative group'>
        <TextField
          placeholder={i18n.t('Search personnel...')}
          value={query()}
          onInput={(e) => {
            setQuery(e.currentTarget.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          class='pr-10'
        />
        <div class='absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/40 transition-colors'>
          <Search size={16} />
        </div>
      </div>

      <Show when={isOpen() && filteredUsers().length > 0}>
        <div
          class='absolute top-full left-0 right-0 mt-2 z-[300] bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-3xl'
        >
          <div class='max-h-[250px] overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1'>
            <For each={filteredUsers()}>
              {(user) => (
                <button
                  type='button'
                  onClick={() => handleSelect(user)}
                  class='flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left group'
                >
                  <div class='w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white/10 group-hover:text-white transition-all'>
                    <UserIcon size={16} />
                  </div>
                  <div class='flex flex-col'>
                    <Typography class='text-sm font-bold text-white leading-none mb-1 uppercase tracking-tight'>
                      {user.name}
                    </Typography>
                    <Typography variant='pre' class='text-[9px] text-white/20 uppercase tracking-widest'>
                      {user.identifier}
                    </Typography>
                  </div>
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={isOpen() && filteredUsers().length === 0 && query()}>
        <div
          class='absolute top-full left-0 right-0 mt-2 z-[300] bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-3xl'
        >
          <Typography variant='pre' class='text-[10px] text-white/20 uppercase tracking-widest leading-none'>
            {i18n.t('No personnel matches found')}
          </Typography>
        </div>
      </Show>
    </div>
  );
};

export default UserSelect;
