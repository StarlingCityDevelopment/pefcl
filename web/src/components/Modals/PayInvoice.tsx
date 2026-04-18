import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { CheckCircle2, AlertCircle, Calendar, MessageSquare, User, Wallet, ArrowRight } from 'lucide-react';
import { InvoiceEvents } from '@typings/Events';
import type { Invoice, PayInvoiceInput } from '@typings/Invoice';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { accountsAtom, defaultAccountAtom } from '../../data/accounts';
import { invoicesAtom } from '../../data/invoices';
import { transactionBaseAtom } from '../../data/transactions';
import { useConfig } from '../../hooks/useConfig';
import { formatMoney } from '../../utils/currency';
import { fetchNui } from '../../utils/fetchNui';
import AccountSelect from '../AccountSelect';
import Summary from '../Summary';
import Button from '../ui/Button';
import { Typography } from '../ui/Typography';

dayjs.extend(calendar);

interface PayInvoiceModalProps {
  invoice: Invoice;
  onClose(): void;
}

const PayInvoiceModal = ({ onClose, invoice }: PayInvoiceModalProps) => {
  const { isMobile } = useGlobalSettings();
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [, updateInvoices] = useAtom(invoicesAtom);
  const [, updateTransactions] = useAtom(transactionBaseAtom);
  const [selectedAccountId, setSelectedAccountId] = useState(defaultAccount?.id ?? 0);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const config = useConfig();
  const { t } = useTranslation();

  const expiresDate = dayjs(invoice.expiresAt);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);

  const handlePayInvoice = () => {
    setError('');
    setIsLoading(true);
    const payload: PayInvoiceInput = {
      fromAccountId: selectedAccountId,
      invoiceId: invoice.id,
    };

    fetchNui(InvoiceEvents.PayInvoice, payload)
      .then(() => {
        setIsPaid(true);
        updateInvoices();
        updateAccounts();
        updateTransactions();
        setTimeout(onClose, 2000);
      })
      .catch((err) => {
        setError(err.message || t('Failed to pay invoice'));
      })
      .finally(() => setIsLoading(false));
  };

  if (isPaid) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 min-h-[300px]">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 transition-transform animate-in zoom-in duration-500">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <Typography variant="h2" className="italic uppercase mb-1">
          {t('Settled')}
        </Typography>
        <Typography className="text-slate-400 text-sm">
          {t('Invoice has been successfully paid.')}
        </Typography>
      </div>
    );
  }

  const hasEnoughFunds = (selectedAccount?.balance ?? 0) >= invoice.amount;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-6 w-full">
        <Typography variant="pre" className="text-primary/60 font-medium text-xs uppercase tracking-wider">
          {t('Invoice Statement')}
        </Typography>
        <div className="h-px flex-1 bg-white/5" />
        <Typography variant="pre" className="text-white/40 font-medium text-[10px] tracking-widest uppercase">
          #{invoice.id.toString().padStart(6, '0')}
        </Typography>
      </div>

      <div className="flex flex-col mb-8">
        <Typography variant="h1" className="text-5xl font-light tracking-tight text-white mb-2">
          {formatMoney(invoice.amount, config.general)}
        </Typography>
      </div>

      {/* Main Content: Single Column Stack */}
      <div className="flex flex-col gap-6 flex-1">
        
        {/* Details Card */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0">
              <User className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <Typography variant="label" className="mb-0.5 text-[10px] opacity-40 uppercase tracking-widest font-medium">
                {t('From')}
              </Typography>
              <Typography className="text-white font-medium text-sm tracking-tight leading-tight break-words">
                {invoice.from}
              </Typography>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0">
              <MessageSquare className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <Typography variant="label" className="mb-0.5 text-[10px] opacity-40 uppercase tracking-widest font-medium">
                {t('Message')}
              </Typography>
              <Typography className="text-white/80 text-sm leading-relaxed break-words whitespace-pre-wrap">
                {invoice.message}
              </Typography>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 shrink-0">
              <Calendar className="w-4 h-4" />
              <Typography variant="pre" className="text-[10px] font-medium uppercase tracking-widest opacity-60">
                {t('Expires')}
              </Typography>
            </div>
            <Typography className="text-white/90 text-sm font-medium leading-none truncate ml-2">
              {expiresDate.format(t('DATE_FORMAT'))}
              <span className="ml-2 opacity-50 font-normal">/ {expiresDate.fromNow()}</span>
            </Typography>
          </div>
        </div>

        {/* Payment Configuration */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <Typography variant="pre" className="font-medium uppercase tracking-widest text-xs text-white/60">
              {t('Payment Source')}
            </Typography>
          </div>

          <AccountSelect
            isFromAccount
            accounts={accounts}
            onSelect={setSelectedAccountId}
            selectedId={selectedAccountId}
          />
        </div>

        {/* Financial Summary */}
        <div className="mt-2">
          <Summary balance={selectedAccount?.balance ?? 0} payment={invoice.amount} />
        </div>

        {/* Interaction Region */}
        <div className="flex flex-col gap-3 mt-auto pt-8">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <Typography variant="pre" className="text-red-500 leading-tight text-[11px]">
                {error}
              </Typography>
            </div>
          )}

          <Button
            className="w-full h-14 text-base font-medium transition-all"
            onClick={handlePayInvoice}
            disabled={!selectedAccountId || !hasEnoughFunds || isLoading}
          >
            {isLoading ? t('Processing...') : t('Authorize Payment')}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full h-12 text-xs font-medium text-white/40 hover:text-white transition-all" 
            onClick={onClose}
            disabled={isLoading}
          >
            {t('Cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PayInvoiceModal;


