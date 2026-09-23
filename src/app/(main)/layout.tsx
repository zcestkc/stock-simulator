import { ReactNode } from 'react';
import HomeLayout from './_components/home-layout';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default AppLayout;
