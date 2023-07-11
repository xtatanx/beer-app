import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html className="text-gray-900 antialiased">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-neutral-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
