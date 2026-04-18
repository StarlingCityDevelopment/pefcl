import Layout from '@components/Layout';
import TransferFunds from '@components/TransferFunds';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Transfer = () => {
 const { t } = useTranslation();

 return (
 <Layout title={t('Transfer Funds')}>
 <div className="max-w-2xl">
 <TransferFunds />
 </div>
 </Layout>
 );
};

export default Transfer;
