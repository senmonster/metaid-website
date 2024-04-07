'use client';
import type { Metadata } from 'next';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { AppProvider } from './provider';

import '@mantine/core/styles.css'; // mantine css style
import './globals.css'; // tailwind css style
import './react-toastify.css';

import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';

// export const metadata: Metadata = {
//   title: 'MetaID',
//   description: 'Cross-Chain DID Protocol Born for Web3',
// };

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
        <RecoilRoot>
          <MantineProvider>
            <AppProvider>{children}</AppProvider>
            <ToastContainer
              position='top-center'
              toastStyle={{
                width: '380px',
              }}
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme='light'
              closeButton={false}
            />
          </MantineProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
