import { ReactNode } from 'react';

export const AuthCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <>
      <h2 className="mt-3 text-center text-3xl font-extrabold text-foreground">
        {title}
      </h2>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </>
  );
};
