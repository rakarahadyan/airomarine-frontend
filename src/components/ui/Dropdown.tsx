'use client';

import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>{trigger}</Menu. Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-50 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            align === 'right' ?  'right-0' : 'left-0'
          )}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index} disabled={item.disabled}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    disabled={item.disabled}
                    className={cn(
                      'flex w-full items-center gap-2 px-4 py-2 text-sm',
                      active && 'bg-gray-100 dark:bg-gray-700',
                      item. danger
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-200',
                      item.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {item. icon}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

interface DropdownButtonProps {
  children: ReactNode;
  className?: string;
}

export function DropdownButton({ children, className }: DropdownButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
        className
      )}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4" />
    </button>
  );
}