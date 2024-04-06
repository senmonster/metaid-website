'use client';

import React from 'react';
import { Pagination } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { metaidService } from '@/utils/api';
import { usePagination } from '@mantine/hooks';
import { isNil } from 'ramda';
import PinCard from '../PinContent/PinCard';

const BlockContent = () => {
  const pagination = usePagination({ total: 10, initialPage: 1 });

  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ['block', 'list', pagination.active],
    queryFn: () =>
      metaidService.getBlockList({ page: pagination.active, size: 18 }),
  });

  return (
    <>
      <div className='flex flex-col gap-8 p-4 relative'>
        {(data?.msgList ?? []).map((blockNumber) => {
          return (
            <div key={blockNumber} className='flex items-center gap-4'>
              <div className='font-bold text-2xl'>{'#' + blockNumber}</div>
              <div className='grid grid-cols-5 flex-1 gap-2'>
                {!isNil(data?.msgMap) &&
                  data?.msgMap[blockNumber].map((p, index) => {
                    return <PinCard p={p} key={index} />;
                  })}
              </div>
            </div>
          );
        })}
        <Pagination
          className='absolute right-8 bottom-6'
          total={10}
          value={pagination.active}
          onChange={pagination.setPage}
        />
      </div>
    </>
  );
};

export default BlockContent;
