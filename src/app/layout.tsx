import type { Metadata } from 'next';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { AppProvider } from './provider';

import '@mantine/core/styles.css'; // mantine css style
import './globals.css'; // tailwind css style

export const metadata: Metadata = {
  title: 'MetaID',
  description: 'Cross-Chain DID Protocol Born for Web3',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <ColorSchemeScript />
        <link rel='shortcut icon' href='/favicon.svg' />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no'
        />
      </head>
      <body>
        <MantineProvider>
          <AppProvider>{children}</AppProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
