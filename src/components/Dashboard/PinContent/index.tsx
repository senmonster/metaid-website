'use client';

import React from 'react';
import { Pagination } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { metaidService } from '@/utils/api';
import { usePagination } from '@mantine/hooks';
import PinCard from './PinCard';
import { repeat } from 'ramda';

const PinContent = () => {
  const pagination = usePagination({ total: 10, initialPage: 1 });

  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ['pin', 'list', pagination.active],
    queryFn: () =>
      metaidService.getPinList({ page: pagination.active, size: 18 }),
  });

  return (
    <>
      {isError ? (
        'Server Error'
      ) : isLoading ? (
        <div className='grid grid-cols-6 gap-4 p-2'>
          {repeat(1, 18).map((p, index) => {
            return <PinCard key={index} isLoading={true} />;
          })}
        </div>
      ) : (
        <>
          <div className='grid grid-cols-6 gap-4 p-2'>
            {(data?.Pins ?? []).map((p, index) => {
              return <PinCard key={index} p={p} />;
            })}
          </div>
          <Pagination
            className='absolute right-8 bottom-6'
            total={10}
            value={pagination.active}
            onChange={pagination.setPage}
          />
        </>
      )}
    </>
  );
};

export default PinContent;