import { Button } from '@/components/ui/button';
import { Typewriter } from '@/components/ui/header/typewriter';
import { Link } from '@/components/ui/link/link';
import { paths } from '@/lib/paths';
import { GitHubLogoIcon, RocketIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className="flex h-screen items-center bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
        <h2 className="text-3xl tracking-widest text-foreground select-none sm:text-4xl">
          Stock Simulator
        </h2>
        <Typewriter text="What is your risk appetite?" delay={100} infinite />
        <Link href={paths.main.home.getHref()}>
          <Image
            src="/logo.svg"
            width={300}
            height={300}
            alt="Stock Simulator logo"
            className="mx-auto dark:invert"
          />
        </Link>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            <Link href={paths.main.home.getHref()}>
              <Button icon={<RocketIcon />}>Get started</Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex">
            <a
              href="https://github.com/zcestkc/stock-simulator"
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
