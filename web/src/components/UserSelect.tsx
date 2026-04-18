import type { User } from '@typings/user';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from './ui/Fields/TextField';
import { Typography } from './ui/Typography';
import { AnimatePresence, motion } from 'motion/react';
import { User as UserIcon, Search } from 'lucide-react';

interface SelectableUser extends User {
  isDisabled?: boolean;
}

interface UserSelectProps {
  users: SelectableUser[];
  isDisabled?: boolean;
  selectedId?: string;
  onSelect(user?: SelectableUser): void;
}

const UserSelect = ({ users, onSelect }: UserSelectProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredUsers = useMemo(() => {
    if (!query) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.identifier.toLowerCase().includes(query.toLowerCase())
    );
  }, [users, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (user: SelectableUser) => {
    setQuery(user.name);
    setIsOpen(false);
    onSelect(user);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative group">
        <TextField
          placeholder={t('Search personnel...')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pr-10"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/40 transition-colors">
          <Search className="w-4 h-4" />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && filteredUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-[300] bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-3xl"
          >
            <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
              {filteredUsers.map((user) => (
                <button
                  key={user.identifier}
                  onClick={() => handleSelect(user)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white/10 group-hover:text-white transition-all">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <Typography className="text-sm font-bold text-white leading-none mb-1 uppercase tracking-tight">
                      {user.name}
                    </Typography>
                    <Typography variant="pre" className="text-[9px] text-white/20 uppercase tracking-widest">
                      {user.identifier}
                    </Typography>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && filteredUsers.length === 0 && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-[300] bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-3xl"
          >
            <Typography variant="pre" className="text-[10px] text-white/20 uppercase tracking-widest leading-none">
              {t('No personnel matches found')}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserSelect;

