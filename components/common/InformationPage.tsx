import type { ReactNode } from 'react';
import { BackButton } from '@/components/common/BackButton';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

type InformationPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function InformationPage({ eyebrow, title, intro, children }: InformationPageProps) {
  return (
    <>
      <Navbar solid />
      <main className="information-page">
        <div className="information-page__shell">
          <BackButton />
          <header className="information-page__header">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{intro}</p>
          </header>
          <div className="information-page__content">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
