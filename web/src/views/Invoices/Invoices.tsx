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
      <div className='mb-4'>
        <Typography variant='pre' className='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-[10px]'>
          {t('Financial Obligations Index')}
        </Typography>
      </div>

      <div className='flex-1 flex flex-col gap-4 overflow-y-auto pr-1 min-h-0 custom-scrollbar'>
        <div className='flex flex-col gap-2'>
          {invoices.map((invoice) => (
            <InvoiceItem key={invoice.id} invoice={invoice} />
          ))}
        </div>

        {invoices.length === 0 && (
          <div className='flex flex-col items-center justify-center py-24 bg-[var(--gta-panel)] border border-dashed border-[var(--gta-border)] opacity-50 gap-3'>
            <ReceiptText className='w-10 h-10 text-[var(--gta-text-dim)]' />
            <Typography variant='pre' className='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-[10px]'>
              {t('Zero active obligations detected')}
            </Typography>
          </div>
        )}

        <div className='mt-auto py-5 flex flex-row items-center justify-between border-t border-[var(--gta-border)]'>
          <div className='flex flex-col'>
            <Typography variant='pre' className='text-[var(--gta-text-dim)] font-bold uppercase tracking-[0.15em] text-[10px]'>
              {t('Registry Pagination')}
            </Typography>
            <Typography className='text-xs font-bold text-[var(--gta-text)] tracking-wide'>
              {t('Displaying {{from}}-{{to}} of {{total}}', { from: offset + 1, to, total: Math.max(0, total) })}
            </Typography>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='secondary'
              size='icon'
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className='h-8 w-8'
            >
              <ChevronLeft className='w-4 h-4 opacity-60' />
            </Button>

            <div className='flex items-center gap-1 px-3 py-1.5 bg-[var(--gta-surface)] border border-[var(--gta-border)]'>
              {pages > 0 ? (
                [...Array(pages)].map((_, i) => (
                  <button
                    type='button'
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable list
                    key={`inv-page-${i}`}
                    onClick={() => handlePageChange(i + 1)}
                    className={cn(
                      'w-7 h-7 text-[10px] font-bold tracking-wide transition-all uppercase',
                      page === i + 1
                        ? 'bg-[var(--gta-green)] text-black'
                        : 'text-[var(--gta-text-dim)] hover:text-[var(--gta-text)] hover:bg-[var(--gta-surface)]',
                    )}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                <div className='w-7 h-7 flex items-center justify-center'>
                  <Typography className='text-[10px] font-bold text-[var(--gta-text-dim)]'>0</Typography>
                </div>
              )}
            </div>

            <Button
              variant='secondary'
              size='icon'
              disabled={page === pages || pages === 0}
              onClick={() => handlePageChange(page + 1)}
              className='h-8 w-8'
            >
              <ChevronRight className='w-4 h-4 opacity-60' />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Invoices;
