import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  padding: 0.2rem 0 0.2rem 1rem;
  display: flex;
  flex-direction: row;
`;

export const IconWrapper = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: end;
`;

export const ButtonContent = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-items: center;
  font-size: 1.1rem;

  span {
    flex: auto;
  }
`;
