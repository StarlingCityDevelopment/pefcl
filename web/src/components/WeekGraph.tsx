import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Divider, Popover, Stack } from '@mui/material';
import { Box } from '@mui/system';
import type { GetTransactionHistoryResponse } from '@typings/Transaction';
import { formatMoney } from '@utils/currency';
import theme from '@utils/theme';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Count from './ui/Count';
import { Heading6 } from './ui/Typography/Headings';

const Col = styled.div<{ height?: number }>`
  width: 4px;
  border-radius: 3px;
  background-color: ${theme.palette.success.main};
  height: ${({ height }) => `${height}rem`};
  transition: all 0.2s ease;
  opacity: 0.7;
`;

const ExpenseCol = styled(Col)`
  background-color: ${theme.palette.error.main};
`;

const IncomeText = styled(Heading6)`
  color: ${theme.palette.success.main};
  font-weight: 600;
`;

const ExpenseText = styled(Heading6)`
  color: ${theme.palette.error.main};
  font-weight: 600;
`;

interface ColumnProps {
  date: Date;
  income: number;
  expenses: number;
  maxHeight: number;
}

const Column = ({ date, income, expenses, maxHeight }: ColumnProps) => {
  const { t } = useTranslation();
  const config = useConfig();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            bgcolor: '#141416',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.5)',
            mt: -1,
            pointerEvents: 'none',
          },
        }}
      >
        <Box p={1.5}>
          <Stack spacing={1}>
            <Stack spacing={0.25}>
              <Heading6
                sx={{
                  fontSize: '0.5625rem',
                  color: theme.palette.text.secondary,
                  letterSpacing: '0.06em',
                }}
              >
                {t('Income')}
              </Heading6>
              <IncomeText sx={{ fontSize: '0.8125rem' }}>{formatMoney(income, config.general)}</IncomeText>
            </Stack>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />
            <Stack spacing={0.25}>
              <Heading6
                sx={{
                  fontSize: '0.5625rem',
                  color: theme.palette.text.secondary,
                  letterSpacing: '0.06em',
                }}
              >
                {t('Expense')}
              </Heading6>
              <ExpenseText sx={{ fontSize: '0.8125rem' }}>{formatMoney(expenses, config.general)}</ExpenseText>
            </Stack>
          </Stack>
        </Box>
      </Popover>

      <Stack
        alignItems='center'
        spacing={1}
        justifyContent='flex-end'
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{ cursor: 'default' }}
      >
        <Stack direction='row' spacing={0.75} alignItems='flex-end' sx={{ minHeight: '3.5rem' }}>
          <ExpenseCol height={(Math.abs(expenses) / (maxHeight || 1)) * 3.5} />
          <Col height={(income / (maxHeight || 1)) * 3.5} />
        </Stack>
        <Count
          amount={Number(date.getDate())}
          sx={{
            fontSize: '0.625rem',
            fontWeight: 500,
            color: theme.palette.text.secondary,
          }}
        />
      </Stack>
    </>
  );
};

interface WeekGraphProps {
  data: GetTransactionHistoryResponse['lastWeek'];
}

const WeekGraph = ({ data }: WeekGraphProps) => {
  const values = Object.values(data);
  const incomeMax = Math.max(...values.map((v) => v.income), 0);
  const expenseMax = Math.max(...values.map((v) => Math.abs(v.expenses)), 0);
  const maxHeight = Math.max(incomeMax, expenseMax);

  return (
    <Box>
      <Stack direction='row' spacing={2.5} justifyContent='flex-end' alignItems='flex-end'>
        {Object.entries(data).map(([key, value]) => (
          <Column key={key} {...value} maxHeight={maxHeight} date={new Date(key)} />
        ))}
      </Stack>
    </Box>
  );
};

export default WeekGraph;
