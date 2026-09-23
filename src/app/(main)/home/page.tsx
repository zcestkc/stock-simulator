import { ContentLayout } from '@/components/layouts/content-layout';
import { WalletSummary } from '@/features/portfolio/components/wallet-summary';

export const metadata = {
  title: 'Home',
  description: 'Home',
};

const HomePage = () => {
  return (
    <ContentLayout title="Home">
      <WalletSummary />
    </ContentLayout>
  );
};

export default HomePage;
