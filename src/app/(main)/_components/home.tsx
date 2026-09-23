import { ContentLayout } from '@/components/layouts/content-layout';
import { WalletSummary } from '@/features/portfolio/components/wallet-summary';

export const Home = () => {
  return (
    <ContentLayout title="Home">
      <WalletSummary />
    </ContentLayout>
  );
};
