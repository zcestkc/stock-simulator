import { ContentLayout } from '@/components/layouts/content-layout';
import { CryptoView } from '@/features/cryptos/components/crypto-view';

export const Crypto = ({ cryptoId }: { cryptoId: string }) => {
  return (
    <ContentLayout title={cryptoId}>
      <CryptoView cryptoId={cryptoId} />
    </ContentLayout>
  );
};
