import Layout from '@components/Layout';
import TransactionItem, { TransactionSkeleton } from '@components/TransactionItem';
import Button from '@components/ui/Button';
import Count from '@components/ui/Count';
import { Typography } from '@components/ui/Typography';
import { TransactionEvents } from '@typings/Events';
import type { GetTransactionsResponse, Transaction } from '@typings/Transaction';
import { cn } from '@utils/cn';
import { DEFAULT_PAGINATION_LIMIT } from '@utils/constants';
import { fetchNui } from '@utils/fetchNui';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
    }
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
    <Layout title={t('Ledger History')}>
      <div className='flex flex-col h-full overflow-hidden'>
        <div className='flex items-center justify-between mb-8 px-1'>
          <div className='flex items-center gap-4'>
            <Typography variant='pre' className='text-slate-500 font-bold uppercase tracking-widest text-[11px]'>
              {t('Total Records')}
            </Typography>
            <Count amount={total} />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2 min-h-0'>
          {isLoading ? (
            /* biome-ignore lint/suspicious/noArrayIndexKey: indices are stable for static skeleton list */
            Array.from({ length: 8 }).map((_, i) => <TransactionSkeleton key={i} />)
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => <TransactionItem transaction={transaction} key={transaction.id} />)
          ) : (
            <div className='flex flex-col items-center justify-center py-40 rounded-[3rem] bg-white/[0.01] border border-dashed border-white/5 opacity-40 gap-4'>
              <History className='w-12 h-12 text-slate-500' />
              <Typography variant='pre' className='text-slate-500 font-bold uppercase tracking-widest text-[10px]'>
                {t('Archive empty. No activity detected.')}
              </Typography>
            </div>
          )}
        </div>

        <div className='mt-8 py-8 flex flex-row items-center justify-between border-t border-white/[0.05]'>
          <div className='flex flex-col'>
            <Typography variant='pre' className='text-slate-500 font-bold uppercase tracking-widest text-[10px]'>
              {t('Registry Pagination')}
            </Typography>
            <Typography className='text-xs font-bold text-white tracking-tight'>
              {t('Showing {{from}}-{{to}} of {{total}} results', { from: offset + 1, to, total })}
            </Typography>
          </div>

          <div className='flex items-center gap-3'>
            <Button
              variant='secondary'
              size='icon'
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className='h-10 w-10 rounded-xl'
            >
              <ChevronLeft className='w-5 h-5 opacity-50' />
            </Button>

            <div className='flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5'>
              {[...Array(pages)].map((_, i) => {
                // Only show current, first, last, and neighbors if many pages
                const isNear = Math.abs(page - (i + 1)) <= 1;
                const isEnd = i === 0 || i === pages - 1;

                if (!isNear && !isEnd && pages > 5) {
                  if (i === 1 || i === pages - 2)
                    return (
                      <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: stable list
                        key={`tx-page-ellipsis-${i}`}
                        className='text-slate-700 font-bold'
                      >
                        ...
                      </span>
                    );
                  return null;
                }

                return (
                  <button
                    type='button'
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable list
                    key={`tx-page-${i}`}
                    onClick={() => handlePageChange(i + 1)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-[10px] font-bold tracking-widest transition-all uppercase',
                      page === i + 1
                        ? 'bg-white text-black scale-105'
                        : 'text-slate-500 hover:text-white hover:bg-white/10',
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <Button
              variant='secondary'
              size='icon'
              disabled={page === pages || pages === 0}
              onClick={() => handlePageChange(page + 1)}
              className='h-10 w-10 rounded-xl'
            >
              <ChevronRight className='w-5 h-5 opacity-50' />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
