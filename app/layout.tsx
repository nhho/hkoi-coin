import type { Metadata } from 'next';
import { type ReactNode } from 'react';
import '../styles/globals.css';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'HKOI Coin',
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
