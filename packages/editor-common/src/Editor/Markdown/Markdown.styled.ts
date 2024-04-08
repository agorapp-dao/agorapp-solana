import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  ul {
    list-style: initial;
    padding-left: 40px;
    margin-top: 1rem;
  }

  li {
    margin-bottom: 0.2rem;
  }

  hr {
    margin: 16px 0;
    color: ${p => p.theme.custom.secondary};
  }

  h3 {
    width: 100%;
    display: block;
    padding-top: 1rem;
    font-size: 1.1rem;
    color: ${p => p.theme.custom.textPrimary};
  }

  strong {
    color: ${p => p.theme.custom.textPrimary};
  }

  ol.contains-task-list {
    padding-left: 33px;
    margin-left: 0;
  }

  li.task-list-item::marker {
    color: ${p => p.theme.palette.primary.main};
    font-weight: 500;
  }

  li.task-list-item {
    padding-left: 10px;
    margin-bottom: 16px;
  }
`;

interface IH2Props {
  $exercise?: boolean;
}

export const H2 = styled.h2<IH2Props>`
  width: 100%;
  display: block;
  padding-top: 1rem;
  font-size: 1.3rem;
  color: ${p => p.theme.custom.textPrimary};
  ${({ $exercise }) =>
    $exercise &&
    css`
      color: ${p => p.theme.palette.primary.main};
      border-bottom: 1px solid ${p => p.theme.custom.splitPaneLine};
    `}
`;

export const P = styled.p`
  width: 100%;
  display: block;
  padding-top: 0;
  margin: 0;
  margin-bottom: 1rem;
`;
