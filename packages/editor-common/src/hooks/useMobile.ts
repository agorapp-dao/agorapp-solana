import { useWindowWidth } from '@react-hook/window-size';
import { MOBILE_TRIGGER_WIDTH } from '../constants';
import { useEffect, useState } from 'react';

export const useMobile = () => {
  const width = useWindowWidth();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(width < MOBILE_TRIGGER_WIDTH);
  }, [width]);

  return { mobile };
};
