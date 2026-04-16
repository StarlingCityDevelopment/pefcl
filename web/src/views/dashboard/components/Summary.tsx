import { Heading5, Heading6 } from '@components/ui/Typography/Headings';
import WeekGraph from '@components/WeekGraph';
import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Divider, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { TransactionEvents } from '@typings/Events';
import { GetTransactionHistoryResponse } from '@typings/Transaction';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  padding: 1.25rem;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
`;

const ExpensesIncomeContainer = styled(Box)`
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

const Income = styled(Heading5)`
  color: ${theme.palette.success.main};
  font-weight: 600;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
`;

const Expense = styled(Heading5)`
  color: ${theme.palette.error.main};
  font-weight: 600;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
`;

const Title = styled(Heading6)`
  color: ${theme.palette.text.secondary};
  font-weight: 600;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const DashboardSummary = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const [data, setData] = useState<GetTransactionHistoryResponse | undefined>();

  useEffect(() => {
    fetchNui<GetTransactionHistoryResponse>(TransactionEvents.GetHistory).then(setData);
  }, []);

  return (
    <Container>
      <Title>{t('Weekly summary')}</Title>

      <ExpensesIncomeContainer p={1.5}>
        <Stack
          direction="row"
          spacing={2}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: 'rgba(255,255,255,0.04)' }}
            />
          }
        >
          <Stack spacing={0.25} flex={1}>
            <Heading6
              sx={{
                fontSize: '0.5625rem',
                color: theme.palette.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {t('Income')}
            </Heading6>
            <Income>{formatMoney(data?.income ?? 0, config.general)}</Income>
          </Stack>

          <Stack spacing={0.25} flex={1}>
            <Heading6
              sx={{
                fontSize: '0.5625rem',
                color: theme.palette.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {t('Expenses')}
            </Heading6>
            <Expense>{formatMoney(data?.expenses ?? 0, config.general)}</Expense>
          </Stack>
        </Stack>
      </ExpensesIncomeContainer>

      <Stack spacing={1}>
        <Heading6
          sx={{
            fontSize: '0.5625rem',
            color: theme.palette.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {t('Activity Report')}
        </Heading6>
        <WeekGraph data={data?.lastWeek ?? {}} />
      </Stack>
    </Container>
  );
};

export default DashboardSummary;
