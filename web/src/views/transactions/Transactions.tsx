import Layout from '@components/Layout';
import TransactionItem, { TransactionSkeleton } from '@components/TransactionItem';
import Count from '@components/ui/Count';
import styled from '@emotion/styled';
import { Box, Pagination, Stack, Typography } from '@mui/material';
import { TransactionEvents } from '@typings/Events';
import type { GetTransactionsResponse, Transaction } from '@typings/Transaction';
import { DEFAULT_PAGINATION_LIMIT } from '@utils/constants';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heading2, Heading6 } from '../../components/ui/Typography/Headings';

const TransactionsList = styled(Stack)`
  overflow-y: auto;
  padding-right: 0.25rem;
  flex: 1;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.06);
    border-radius: 10px;
  }
`;

const Transactions = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_PAGINATION_LIMIT);
  const pages = Math.ceil(total / limit);
  const [page, setPage] = useState(1);

  const offset = limit * (page - 1);
  const to = offset + transactions.length;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchNui<GetTransactionsResponse>(TransactionEvents.Get, {
      limit,
      offset,
    })
      .then((res) => {
        if (!res) {
          setIsLoading(false);
          return;
        }

        setLimit(res.limit);
        setTotal(res.total);
        setTransactions(res.transactions);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [offset, limit]);

  return (
    <Layout title={t('Transactions')}>
      <Stack spacing={2} sx={{ height: '100%', overflow: 'hidden' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack direction='row' spacing={1.5} alignItems='center'>
            <Heading6
              sx={{
                color: theme.palette.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontSize: '0.6875rem',
                fontWeight: 600,
              }}
            >
              {t('Total Records')}
            </Heading6>
            <Count amount={total} />
          </Stack>
        </Stack>

        <TransactionsList spacing={0.5}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <TransactionSkeleton key={i} />)
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => <TransactionItem transaction={transaction} key={transaction.id} />)
          ) : (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant='body2' sx={{ color: theme.palette.text.secondary }}>
                {t('No transactions found')}
              </Typography>
            </Box>
          )}
        </TransactionsList>

        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          sx={{
            pt: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            mt: 'auto',
          }}
        >
          <Typography variant='caption' sx={{ color: theme.palette.text.secondary, fontSize: '0.6875rem' }}>
            {t('Showing {{from}}-{{to}} of {{total}} results', { from: offset + 1, to, total })}
          </Typography>
          <Pagination
            count={pages}
            shape='rounded'
            onChange={handleChange}
            page={page}
            color='primary'
            size='small'
            sx={{
              '& .MuiPaginationItem-root': {
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
                minWidth: 28,
                height: 28,
                '&.Mui-selected': {
                  color: theme.palette.text.primary,
                  background: 'rgba(255, 255, 255, 0.06)',
                },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.04)',
                },
              },
            }}
          />
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Transactions;
