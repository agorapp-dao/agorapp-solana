import styled, { css } from 'styled-components';

type TProps = {
  level: number;
};

export const Wrapper = styled.div<TProps>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 ${p => p.level * 0.3}rem;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
`;

export const ActiveLink = styled.button`
  border: 0;
  background: transparent;
  font-size: 1rem;
  width: 100%;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: ${p => p.theme.custom.textSecondary};

  &:hover {
    background: ${p => p.theme.custom.cardBg};
  }

  strong {
    font-weight: 300;
  }

  :hover {
    strong {
      color: ${p => p.theme.custom.cardBg};
    }
  }
`;

interface ILevelProps {
  level: number;
}

export const Number = styled.div<ILevelProps>`
  width: 2.4rem;
  text-align: left;
  ${({ level }) =>
    level === 1 &&
    css`
      width: 1.8rem;
    `}
`;

export const Name = styled.div<TProps>`
  flex: 1 1 auto;
  text-align: left;
`;

export const Status = styled.div`
  width: 30px;
  margin-right: 1rem;
`;
