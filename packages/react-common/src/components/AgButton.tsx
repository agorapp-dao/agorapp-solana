import { useMemo } from 'react';
import { SxProps } from '@mui/system';
import * as S from './AgButton.styled';
import { TReactChildren } from '../types/misc';
import { Theme } from '@mui/material/styles';

function getBtnColor(
  theme: Theme,
  color: TAppButtonColor,
  brand: TAppButtonBrand,
  hover?: boolean,
): string {
  if (!theme.brands || !theme.buttons) return '';
  // highest priority is brand color
  if (brand && brand in theme.brands) return theme.brands[brand][hover ? 'btnBgHover' : 'btnBg'];
  // for secondary color we use default theme color
  if (color === 'secondary') return '';
  // otherwise we use color for buttons
  if (color && color in theme.buttons) return theme.buttons[color][hover ? 'btnBgHover' : 'btnBg'];
  return '';
}

type TAppButtonColor = 'primary' | 'secondary' | 'violet' | 'yellow';
type TAppButtonBrand = 'rareSkills' | undefined;

interface IAppButtonProps {
  children?: TReactChildren | string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // is optional because it can be used as submit button
  disabled?: boolean;
  capitalize?: boolean;
  size?: 'small' | 'medium' | 'large';
  brand?: TAppButtonBrand;
  color?: TAppButtonColor;
  icon?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const AgButton: React.FC<IAppButtonProps> = ({
  children,
  href,
  onClick,
  disabled = false,
  capitalize = false,
  size = 'medium',
  color = 'primary',
  icon = false,
  type = 'button',
  brand,
  startIcon,
  endIcon,
}) => {
  const styles = useMemo(() => {
    const capitalizeProp = capitalize ? 'capitalize' : 'initial';
    const style: SxProps<Theme> = {
      textTransform: capitalizeProp,
      whiteSpace: 'nowrap',
      fontWeight: 900,
      background: theme => getBtnColor(theme, color, brand),
      // underlay color must be defined otherwise hover effect will not work (will blink)
      backgroundColor: theme => getBtnColor(theme, color, brand, true),
      '&:hover': {
        backgroundColor: theme => getBtnColor(theme, color, brand, true),
        background: theme => getBtnColor(theme, color, brand, true),
      },
    };

    switch (size) {
      case 'small':
        return { ...style, borderRadius: '1rem', fontSize: '0.8rem', padding: '4px 15px' };
      case 'medium':
        return { ...style, borderRadius: '1.5rem', fontSize: '1rem', padding: '6px 25px' };
      case 'large':
        return { ...style, borderRadius: '2rem', fontSize: '1.25rem', padding: '12px 30px' };
      default:
        throw new Error('Undefined image size');
    }
  }, [size, capitalize, color, brand]);

  return (
    <S.Button
      startIcon={startIcon}
      endIcon={endIcon}
      href={href}
      type={type}
      color={color === 'primary' ? 'primary' : 'secondary'}
      variant="contained"
      size={size}
      onClick={onClick}
      sx={styles}
      disabled={disabled}
      className={`${icon && 'icon'} ${disabled && 'disabled'}`}
    >
      {children}
    </S.Button>
  );
};
