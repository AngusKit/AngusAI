import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

import { cn } from './utils';
import { Button, buttonVariants } from './button';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role='navigation'
      aria-label='pagination'
      data-slot='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot='pagination-content' className={cn('flex flex-row items-center gap-1', className)} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot='pagination-item' {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>;

function PaginationLink({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot='pagination-link'
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, children, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label='Go to previous page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className='hidden sm:block'>{children || 'Previous'}</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, children, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label='Go to next page'
      size='default'
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className='hidden sm:block'>{children || 'Next'}</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className='size-4' />
      <span className='sr-only'>More pages</span>
    </span>
  );
}

type XcanPage = {
  className?: string;
  pageSize: number;
  pageNo: number;
  total: number;
  onChange: (value: { pageSize: number; pageNo: number }) => void;
};

function XcanPagination(props: XcanPage) {
  const [currentPage, setCurrentPage] = useState(props.pageNo || 1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const _totalPages = Math.ceil(props.total / (props.pageSize || 5));
    setTotalPages(_totalPages);
  }, [props.total, props.pageSize]);

  useEffect(() => {
    setCurrentPage(props.pageNo || 1);
  }, [props.pageNo]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    props.onChange({
      pageNo: newPage,
      pageSize: props.pageSize,
    });
  };

  const renderPageNumbers = () => {
    let numbers = [];
    let showleftEllipsis = false;
    let showrightEllipsis = false;
    if (totalPages <= 6) {
      numbers = Array.from({ length: totalPages -1  }, (_, i) => i + 2);
    } else {
      if (currentPage <= 4) {
        numbers = Array.from({ length: 4 }, (_, i) => i + 2);
        showrightEllipsis = true;
      } else if (currentPage >= totalPages - 3) {
        numbers = Array.from({ length: 4 }, (_, i) => totalPages + i - 4);
        showleftEllipsis = true;
      } else {
        numbers = Array.from({ length: 5 }, (_, i) => currentPage - 2 + i);
        showleftEllipsis = true;
        showrightEllipsis = true;
      }
    }

    return (
      <>
        {showleftEllipsis && <PaginationEllipsis />}
        {numbers.map(page => (
          <PaginationItem key={page}>
            <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className='cursor-pointer'>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {showrightEllipsis && <PaginationEllipsis />}
      </>
    );
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          >
            上一页
          </PaginationPrevious>
        </PaginationItem>
        {
          totalPages > 1 && (
            <PaginationItem key={1}>
              <PaginationLink
                onClick={() => handlePageChange(1)}
                isActive={currentPage === 1}
                className='cursor-pointer'
              >
                {1}
              </PaginationLink>
            </PaginationItem>
          )
        }
        {
          renderPageNumbers()
        }
        {
          totalPages > 6 && (
            <PaginationItem key={totalPages}>
              <PaginationLink
                onClick={() => handlePageChange(totalPages)}
                isActive={currentPage === totalPages}
                className='cursor-pointer'
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )
        }
        {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={currentPage === page}
              className='cursor-pointer'
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))} */}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          >
            下一页
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  XcanPagination,
};
