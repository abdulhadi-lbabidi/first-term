import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { RoomFilterOptions } from '../types';

export function useRoomFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filters from search parameters
  const filters: RoomFilterOptions = useMemo(() => ({
    q: searchParams.get('q') || undefined,
    branch: searchParams.get('branch') || undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    stars: searchParams.get('stars') ? Number(searchParams.get('stars')) : undefined,
    capacity: searchParams.get('capacity') ? Number(searchParams.get('capacity')) : undefined,
    available: searchParams.get('available') === 'true' ? true : searchParams.get('available') === 'false' ? false : undefined,
  }), [searchParams]);

  // Update filters in search parameters
  const updateFilters = (newFilters: RoomFilterOptions) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 0) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
  };

  // Get active filters count (excluding default/empty ones)
  const activeFiltersCount = useMemo(() => 
    Object.entries(filters).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    ).length,
    [filters]
  );

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    filters,
    updateFilters,
    clearFilters,
    activeFiltersCount,
  };
}
