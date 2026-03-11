'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from './utils';

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  /** 进度条填充部分的额外样式（用于占比配色） */
  indicatorClassName?: string;
  /** 进度条填充部分的颜色（内联样式，优先级高于 indicatorClassName） */
  indicatorStyle?: React.CSSProperties;
}

function Progress({ className, value, indicatorClassName, indicatorStyle, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className={cn(
          'h-full w-full flex-1 transition-all',
          indicatorClassName ?? 'bg-primary'
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          ...indicatorStyle,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
