import type { ButtonHTMLAttributes } from 'react';
import { Icon } from './Icon';
import type { IconName } from '@/types';
import './IconButton.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Accessible label; also used as the tooltip. */
  label: string;
  size?: number;
  variant?: 'ghost' | 'solid';
}

/**
 * A compact, accessible icon button with a hover/active micro-interaction.
 * Disabled state dims and blocks pointer events.
 */
export function IconButton({
  icon,
  label,
  size = 18,
  variant = 'ghost',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`wd-icon-btn wd-icon-btn--${variant} ${className ?? ''}`}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}
