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
    check_in: searchParams.get('check_in') || undefined,
    check_out: searchParams.get('check_out') || undefined,
  }), [searchParams]);

  // Update filters in search parameters
  const updateFilters = (newFilters: Partial<RoomFilterOptions>) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '' || value === 0) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      return params;
    });
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
