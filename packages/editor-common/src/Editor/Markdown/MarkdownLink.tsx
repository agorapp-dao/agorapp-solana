import { FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import * as S from './MarkdownLink.styled';
import { useRouter } from 'next/router';

type TProps = {
  href: string | undefined;
  children?: ReactNode;
};

export const MarkdownLink: FC<TProps> = ({ href, children }: TProps) => {
  const router = useRouter();

  href = href || router.asPath;
  let target: HTMLAttributeAnchorTarget | undefined = '_blank';

  if (href.startsWith('../')) {
    href = router.asPath + '/' + href;
    target = undefined;
  }

  return (
    <S.HrefLink href={href || '#'} target={target}>
      {children}
    </S.HrefLink>
  );
};
