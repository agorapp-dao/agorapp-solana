import createCache from '@emotion/cache';

const createEmotionCache = () => {
  return createCache({ key: 'css-global', prepend: true });
};

export default createEmotionCache;
