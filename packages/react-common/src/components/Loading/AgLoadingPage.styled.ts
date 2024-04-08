import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .loader {
    display: flex;
    flex-direction: column;
    align-items: center;

    .row {
      display: flex;
    }
  }

  .arrow {
    width: 0;
    height: 0;
    margin: 0 -6px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 21.6px solid #fd7000;
    animation: blink 1s infinite;
    filter: drop-shadow(0 0 18s #fd7000);

    &.down {
      transform: rotate(180deg);
    }

    &.outer-1 {
      animation-delay: -0.055555555555556s;
    }
    &.outer-2 {
      animation-delay: -0.111111111111111s;
    }
    &.outer-3 {
      animation-delay: -0.166666666666667s;
    }
    &.outer-4 {
      animation-delay: -0.222222222222222s;
    }
    &.outer-5 {
      animation-delay: -0.277777777777778s;
    }
    &.outer-6 {
      animation-delay: -0.333333333333333s;
    }
    &.outer-7 {
      animation-delay: -0.388888888888889s;
    }
    &.outer-8 {
      animation-delay: -0.444444444444444s;
    }
    &.outer-9 {
      animation-delay: -0.5s;
    }
    &.outer-10 {
      animation-delay: -0.555555555555556s;
    }
    &.outer-11 {
      animation-delay: -0.611111111111111s;
    }
    &.outer-12 {
      animation-delay: -0.666666666666667s;
    }
    &.outer-13 {
      animation-delay: -0.722222222222222s;
    }
    &.outer-14 {
      animation-delay: -0.777777777777778s;
    }
    &.outer-15 {
      animation-delay: -0.833333333333333s;
    }
    &.outer-16 {
      animation-delay: -0.888888888888889s;
    }
    &.outer-17 {
      animation-delay: -0.944444444444444s;
    }
    &.outer-18 {
      animation-delay: -1s;
    }

    &.inner-1 {
      animation-delay: -0.166666666666667s;
    }
    &.inner-2 {
      animation-delay: -0.333333333333333s;
    }
    &.inner-3 {
      animation-delay: -0.5s;
    }
    &.inner-4 {
      animation-delay: -0.666666666666667s;
    }
    &.inner-5 {
      animation-delay: -0.833333333333333s;
    }
    &.inner-6 {
      animation-delay: -1s;
    }
  }

  @keyframes blink {
    0% {
      opacity: 0.1;
    }
    30% {
      opacity: 1;
    }
    100% {
      opacity: 0.1;
    }
  }
`;
