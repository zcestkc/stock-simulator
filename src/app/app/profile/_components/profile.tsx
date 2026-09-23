'use client';

import { useNotifications } from '@/components/ui/notifications';
import { useUser } from '@/lib/auth';

type EntryProps = {
  label: string;
  value: string;
};
const Entry = ({ label, value }: EntryProps) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
    <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">
      {value}
    </dd>
  </div>
);

export const Profile = () => {
  const user = useUser();
  const { addNotification } = useNotifications();
  if (!user) return null;

  return (
    <div className="overflow-hidden bg-card shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium leading-6 text-foreground">
            User Information
          </h3>
          {/* <UpdateProfile /> */}
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Personal details of the user.
        </p>
      </div>
      <div className="border-t border-border px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-border">
          <Entry label="Username" value={user.data?.username ?? ''} />
          <Entry label="Role" value={user.data?.role ?? ''} />
        </dl>
      </div>
    </div>
  );
};
