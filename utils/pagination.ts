import { useState, useCallback } from 'react';

interface PaginationParams {
  limit: number;
  page:number;
  pagesize:number;
}

interface UsePaginationProps<T> {
  initialData: T[];
  getData: (params: PaginationParams) => Promise<T[]>;
}

function usePagination<T>({ initialData, getData }: UsePaginationProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
  
    try {
      const nextPage = page + 1;
      const newData = await getData({ page: nextPage, pagesize: 3 ,limit: 1});
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData((prevData) => [...prevData, ...newData]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [getData, isLoading, hasMore, page]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const newData = await getData({ limit: 1,page:1,pagesize:3 });
      setData(newData);
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  }, [getData]);

  return { data, isLoading, isRefreshing, fetchMore, refresh, hasMore };
}

export default usePagination;
