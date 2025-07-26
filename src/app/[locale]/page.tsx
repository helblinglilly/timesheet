import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ClientTranslationComponent } from '~/app/_components/i18n/ClientTranslationComponent';
import { ServerTranslationComponent } from '~/app/_components/i18n/ServerTranslationComponent';
import { LatestPost } from '~/app/_components/post';
import { languages } from '~/i18n/settings';
import { api, HydrateClient } from '~/trpc/server';

interface HomeProps {
  params: {
    locale: string;
  };
}

export default async function Home({ params: { locale } }: HomeProps) {
  // Validate that locale is supported
  if (!languages.includes(locale)) {
    redirect('/en'); // Redirect to default locale if not supported
  }

  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"

            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
          </div>


          {/* i18n Demo Components */}
          <div className="w-full max-w-4xl">
            {/* Server Component Demo */}
            <ServerTranslationComponent locale={locale} />

            {/* Client Component Demo */}
            <ClientTranslationComponent />
          </div>

          <LatestPost />
        </div>
      </main>
    </HydrateClient>
  );
}
