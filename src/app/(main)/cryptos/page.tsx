import { ContentLayout } from '@/components/layouts/content-layout';
import { Bitcoin } from 'lucide-react';

export const metadata = {
  title: 'Cryptos',
  description: 'Crypto trading is coming soon',
};

const CryptosPage = () => {
  return (
    <ContentLayout title="Cryptos">
      <div className="flex flex-col items-center gap-3 rounded-lg border bg-card px-6 py-16 text-center">
        <Bitcoin className="size-10 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Coming soon</h2>
        <p className="max-w-sm text-muted-foreground">
          Crypto trading is on its way. In the meantime, you can invest in
          stocks.
        </p>
      </div>
    </ContentLayout>
  );
};

export default CryptosPage;
