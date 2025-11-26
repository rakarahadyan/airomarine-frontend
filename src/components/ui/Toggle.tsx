'use client';

import { Switch } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export function Toggle({
  enabled,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
}: ToggleProps) {
  const sizes = {
    sm: {
      switch: 'h-5 w-9',
      dot: 'h-4 w-4',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'h-6 w-11',
      dot: 'h-5 w-5',
      translate: 'translate-x-5',
    },
  };

  return (
    <Switch. Group as="div" className="flex items-center justify-between">
      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <Switch.Label
              as="span"
              className="text-sm font-medium text-gray-900 dark:text-white"
              passive
            >
              {label}
            </Switch.Label>
          )}
          {description && (
            <Switch.Description as="span" className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </Switch. Description>
          )}
        </span>
      )}
      <Switch
        checked={enabled}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          enabled ?  'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
          disabled && 'opacity-50 cursor-not-allowed',
          sizes[size]. switch
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            enabled ? sizes[size].translate : 'translate-x-0',
            sizes[size].dot
          )}
        />
      </Switch>
    </Switch. Group>
  );
}