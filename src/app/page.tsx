import { Button } from '@/components/ui/button';
import { Typewriter } from '@/components/ui/header/Typewriter';
import { Link } from '@/components/ui/link/link';
import { paths } from '@/config/paths';
import { GitHubLogoIcon, RocketIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className="flex h-screen items-center bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
        <h2 className="text-3xl tracking-widest text-foreground sm:text-4xl select-none">
          STALK
        </h2>
        <Typewriter text="An investment simulator" delay={100} infinite />
        <Link href={paths.app.home.getHref()}>
          <Image
            src="/logo.svg"
            width={300}
            height={300}
            alt="Stalk Logo"
            className="dark:invert"
          />
        </Link>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Link href={paths.app.home.getHref()}>
              <Button icon={<RocketIcon />}>Get started</Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex">
            <a
              href="https://github.com/zcestkc/stalk"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" icon={<GitHubLogoIcon />}>
                Github Repo
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
