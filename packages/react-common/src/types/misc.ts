import React from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';

export type TReactChildren = ReactElement | ReactElement[] | React.ReactNode | React.ReactNode[];

export enum EColorMode {
  'light' = 'light',
  'dark' = 'dark',
}

export enum EColorBrand {
  agorApp = 'agorApp',
  purple = 'purple',
  motoko = 'motoko',
}
