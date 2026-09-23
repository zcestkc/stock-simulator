import { ContentLayout } from '@/components/layouts/content-layout';
import { UserProfile } from '@/features/auth/components/user-profile';

export const metadata = {
  title: 'Profile',
  description: 'Profile',
};

const ProfilePage = () => {
  return (
    <ContentLayout title="Profile">
      <UserProfile />
    </ContentLayout>
  );
};

export default ProfilePage;
