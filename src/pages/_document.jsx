import { Html, Head, Main, NextScript } from 'next/document';
function Document() {
  return (
    <Html>
      <Head>
        <meta name="theme-color" content="#2296f3" />
        <meta name="title" content="TITLE_CONTENT" />
        <meta name="description" content="DESCRIPTION_CONTENT" />
        <meta name="keywords" content="KEYWORDS_CONTENT" />

        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />

        <meta charSet="utf-8" />
      </Head>
      <body style={{ minWidth: '1650px' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
