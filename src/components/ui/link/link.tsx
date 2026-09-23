import NextLink, { LinkProps as NextLinkProps } from 'next/link';

import { cn } from '@/utils/cn';

export type LinkProps = {
  className?: string;
  children: React.ReactNode;
  target?: string;
} & NextLinkProps;

export const Link = ({ className, children, href, ...props }: LinkProps) => {
  return (
    <NextLink
      href={href}
      className={cn('text-muted-foreground hover:text-foreground', className)}
      {...props}
    >
      {children}
    </NextLink>
  );
};
