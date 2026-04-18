import InvoiceItem from '@components/InvoiceItem';
import Layout from '@components/Layout';
import Button from '@components/ui/Button';
import { Typography } from '@components/ui/Typography';
import { invoicesAtom } from '@data/invoices';
import { cn } from '@utils/cn';
import { useAtom } from 'jotai';
import { ChevronLeft, ChevronRight, ReceiptText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Invoices = () => {
  const { t } = useTranslation();
  const [invoicesData, updateInvoices] = useAtom(invoicesAtom);
  const { invoices, total, limit } = invoicesData;
  const pages = Math.ceil(total / limit);
  const [page, setPage] = useState(1);

  const offset = limit * (page - 1);
  const to = offset + limit > total ? total : offset + limit;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    updateInvoices({
      limit,
      offset,
    });
  }, [limit, offset, updateInvoices]);

  return (
    <Layout title={t('Outstanding Commitments')}>
      <div className='mb-6'>
        <Typography variant='pre' className='text-slate-500 font-bold uppercase tracking-widest text-[11px]'>
          {t('Financial Obligations Index')}
        </Typography>
      </div>

      <div className='flex-1 flex flex-col gap-6 overflow-y-auto pr-2 min-h-0 custom-scrollbar'>
        <div className='flex flex-col gap-4'>
          {invoices.map((invoice) => (
            <InvoiceItem key={invoice.id} invoice={invoice} />
          ))}
        </div>

        {invoices.length === 0 && (
          <div className='flex flex-col items-center justify-center py-32 rounded-[3rem] bg-white/[0.01] border border-dashed border-white/5 opacity-40 gap-4'>
            <ReceiptText className='w-12 h-12 text-slate-500' />
            <Typography variant='pre' className='text-slate-500 font-bold uppercase tracking-widest text-[10px]'>
              {t('Zero active obligations detected')}
            </Typography>
          </div>
        )}

        <div className='mt-auto py-8 flex flex-row items-center justify-between border-t border-white/[0.05]'>
          <div className='flex flex-col'>
            <Typography variant='pre' className='text-slate-500 font-bold uppercase tracking-widest text-[10px]'>
              {t('Registry Pagination')}
            </Typography>
            <Typography className='text-xs font-bold text-white tracking-tight'>
              {t('Displaying {{from}}-{{to}} of {{total}}', { from: offset + 1, to, total: Math.max(0, total) })}
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

            <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/5'>
              {pages > 0 ? (
                [...Array(pages)].map((_, i) => (
                  <button
                    type='button'
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable list
                    key={`inv-page-${i}`}
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
                ))
              ) : (
                <div className='w-8 h-8 flex items-center justify-center'>
                  <Typography className='text-[10px] font-black text-slate-700'>0</Typography>
                </div>
              )}
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

export default Invoices;
