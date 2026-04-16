import styled from '@emotion/styled';
import { ListSubheader, MenuItem, SelectChangeEvent, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Account, AccountRole, AccountType, ExternalAccount } from '@typings/Account';
import { ResourceConfig } from '../../../typings/config';
import { useConfig } from '../hooks/useConfig';
import { formatMoney } from '../utils/currency';
import theme from '../utils/theme';
import { BodyText } from './ui/Typography/BodyText';
import { Heading6 } from './ui/Typography/Headings';
import Select from './ui/Select';
import Button from './ui/Button';
import { Box } from '@mui/system';
import AddExternalAccountModal from './Modals/AddExternalAccount';
import { useGlobalSettings } from '@hooks/useGlobalSettings';

// Prefix to namespace external account IDs so they never collide with internal ones
const EXT_PREFIX = 'ext-';

const BalanceText = styled(Heading6)`
  color: ${theme.palette.primary.main};
`;

const StyledMenuItem = styled(MenuItem)`
  &.Mui-selected {
    background: ${theme.palette.background.dark12};
  }

  &.Mui-selected:focus-visible,
  &.Mui-selected:focus,
  &.Mui-selected:hover {
    background: ${theme.palette.background.dark12};
  }

  &.Mui-focusVisible {
    background: ${theme.palette.background.dark4};
  }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 0.75rem;
`;

const Option: React.FC<{
  account: Account;
  config: ResourceConfig;
  isDisabledByContributor?: boolean;
}> = ({ account, config, isDisabledByContributor }) => {
  const { t } = useTranslation();
  return (
    <ListItem>
      <Stack p="0rem 0.5rem">
        <BodyText>{account.accountName}</BodyText>
        {isDisabledByContributor ? (
          <Typography variant="caption">
            {t('Contributors cannot use money in shared accounts.')}
          </Typography>
        ) : (
          <BalanceText>{formatMoney(account.balance, config.general)}</BalanceText>
        )}
      </Stack>

      <Stack direction="row" spacing={2}>
        <Heading6>{account.type === AccountType.Personal ? t('Personal') : t('Shared')}</Heading6>
      </Stack>
    </ListItem>
  );
};

interface AccountSelectProps {
  accounts: Account[];
  selectedId?: number;
  excludeId?: number;
  isFromAccount?: boolean;
  isExternalSelected?: boolean;
  externalAccounts?: ExternalAccount[];
  onSelect(accountId: number, isExternal?: boolean): void;
}

const AccountSelect = ({
  accounts,
  onSelect,
  selectedId,
  excludeId,
  isFromAccount = false,
  isExternalSelected = false,
  externalAccounts = [],
}: AccountSelectProps) => {
  const { t } = useTranslation();
  const config = useConfig();
  const [isExternalOpen, setIsExternalOpen] = useState(false);

  // Build the controlled value string:
  // - "0" = nothing selected
  // - "123" = internal account with id 123
  // - "ext-456" = external account with id 456
  const currentValue =
    selectedId === undefined || selectedId === 0
      ? '0'
      : isExternalSelected
      ? `${EXT_PREFIX}${selectedId}`
      : selectedId.toString();

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const val = event.target.value.toString();

    if (val.startsWith(EXT_PREFIX)) {
      const extId = Number(val.slice(EXT_PREFIX.length));
      if (!isNaN(extId)) {
        onSelect(extId, true);
      }
    } else {
      const numericValue = Number(val);
      if (!isNaN(numericValue)) {
        onSelect(numericValue, false);
      }
    }
  };

  const handleAddExternalAccount = () => {
    setIsExternalOpen(true);
  };

  const { isMobile } = useGlobalSettings();

  return (
    <div>
      <React.Suspense fallback={null}>
        <AddExternalAccountModal isOpen={isExternalOpen} onClose={() => setIsExternalOpen(false)} />
      </React.Suspense>
      <Select
        value={currentValue}
        onChange={handleChange}
        variant="filled"
        sx={{
          width: '100%',
        }}
        renderValue={(val: any) => {
          const stringVal = val.toString();
          if (stringVal === '0')
            return (
              <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>
                {t('Select account')}
              </Typography>
            );

          if (stringVal.startsWith(EXT_PREFIX)) {
            const extId = stringVal.slice(EXT_PREFIX.length);
            const external = externalAccounts.find((a) => a.id.toString() === extId);
            if (external)
              return (
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {external.name} ({external.number})
                </Typography>
              );
          } else {
            const account = accounts.find((a) => a.id.toString() === stringVal);
            if (account)
              return (
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {account.accountName} — {formatMoney(account.balance, config.general)}
                </Typography>
              );
          }

          return (
            <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>
              {t('Select account')}
            </Typography>
          );
        }}
        MenuProps={{
          disablePortal: isMobile,
          PaperProps: {
            sx: {
              maxHeight: '300px',
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: theme.shadows[10],
              mt: 1,
              '& .MuiMenu-list': {
                padding: '8px',
              },
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
            },
          },
        }}
      >
        {currentValue === '0' && (
          <StyledMenuItem value="0" disabled>
            <ListItem>
              <Stack p="0rem 0.5rem">
                <Heading6>{t('Select account')}</Heading6>
              </Stack>
            </ListItem>
          </StyledMenuItem>
        )}

        {accounts.length > 0 && <ListSubheader>{t('Your accounts')}</ListSubheader>}
        {accounts
          .filter((account) => account.id !== excludeId)
          .map((account) => {
            const isDisabledByContributor =
              isFromAccount && account.role === AccountRole.Contributor;
            return (
              <StyledMenuItem
                key={`int-${account.id}`}
                value={account.id.toString()}
                disabled={currentValue === account.id.toString() || isDisabledByContributor}
              >
                <Option
                  account={account}
                  config={config}
                  isDisabledByContributor={isDisabledByContributor}
                />
              </StyledMenuItem>
            );
          })}

        {externalAccounts.length > 0 && <ListSubheader>{t('External accounts')}</ListSubheader>}
        {externalAccounts.map((account) => (
          <StyledMenuItem key={`ext-${account.id}`} value={`${EXT_PREFIX}${account.id}`}>
            <ListItem>
              <Stack p="0rem 0.5rem">
                <BodyText>{account.name}</BodyText>
                <Heading6>{account.number}</Heading6>
              </Stack>
            </ListItem>
          </StyledMenuItem>
        ))}

        {!isFromAccount && (
          <Box p={1} mt={1} borderTop={`1px solid ${theme.palette.divider}`}>
            <Button fullWidth onClick={handleAddExternalAccount}>
              {t('Add external account')}
            </Button>
          </Box>
        )}
      </Select>
    </div>
  );
};

export default AccountSelect;
