import { ContentLayout } from '@/components/layouts/content-layout';
import { paths } from '@/config/paths';
import { cryptoCurrencies } from '@/data/crypto-currencies';
import Link from 'next/link';

export const metadata = {
  title: 'Cryptos',
  description: 'Cryptos',
};

const CryptosPage = () => {
  return (
    <ContentLayout title="Cryptos">
      {cryptoCurrencies.map(({ code, name }) => (
        <div key={code}>
          <Link href={paths.app.cryptos.getHref() + '/' + code}>{name}</Link>
        </div>
      ))}
    </ContentLayout>
  );
};

export default CryptosPage;
