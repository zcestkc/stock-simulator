import { ContentLayout } from '@/components/layouts/content-layout';
import Counter from './counter';

export const Home = async () => {
  // console.log((await cookies()).get('refreshToken')?.value);
  return (
    <ContentLayout title="Home">
      <h1 className="text-xl">Welcome</h1>
      <Counter />
    </ContentLayout>
  );
};
