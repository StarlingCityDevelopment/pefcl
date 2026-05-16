// web/src/views/transfer/Transfer.tsx
import Layout from "@components/Layout";
import TransferFunds from "@components/TransferFunds";
import i18n from "@utils/i18n";

const Transfer = () => {
  return (
    <Layout title={i18n.t('Transfer Funds')}>
      <div class='max-w-2xl'>
        <TransferFunds />
      </div>
    </Layout>
  );
};

export default Transfer;
