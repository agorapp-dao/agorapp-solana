import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
  DocumentContext,
} from 'next/document';
import { AppType } from 'next/app';
import React from 'react';
import createEmotionServer from '@emotion/server/create-instance';
import { ServerStyleSheet } from 'styled-components';
import createEmotionCache from '../utils/createEmotionCache';

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
}

export default function MyDocument({ emotionStyleTags }: MyDocumentProps) {
  return (
    <Html lang="en" prefix="og: http://ogp.me/ns#">
      <Head>
        <meta
          name="google-site-verification"
          content="IWA9gqV_no85ABkhAqzTQ_GOqTqja7CgoUbvaqPGX-A"
        />
        {/* Insertion point for client. This connects with createEmotionCache.ts */}
        <meta name="emotion-insertion-point" content="" />
        {emotionStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  const sheet = new ServerStyleSheet();

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType>>) =>
          function EnhanceApp(props) {
            // TODO solve this ignore
            // @ts-ignore
            return sheet.collectStyles(<App emotionCache={cache} {...props} />);
          },
      });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);

    const emotionStyleTags = emotionStyles.styles.map(style => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {/*{sheet.getStyleElement()}*/}
          {emotionStyleTags}
        </>
      ),
    };
  } finally {
    sheet.seal();
  }
};
