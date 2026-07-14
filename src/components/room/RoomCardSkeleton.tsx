import { Skeleton } from '@/components/ui/skeleton';

interface RoomCardSkeletonProps {
  layout?: 'grid' | 'list';
}

export default function RoomCardSkeleton({ layout = 'grid' }: RoomCardSkeletonProps) {
  if (layout === 'list') {
    return (
      <div className="relative flex flex-col md:flex-row bg-white dark:bg-ink rounded-3xl overflow-hidden shadow-sm border border-border/40">
        <Skeleton className="md:w-2/5 relative aspect-video md:aspect-auto rounded-none" />
        <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-8 w-2/3 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-5/6 rounded" />
          </div>
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="pt-4 mt-auto flex justify-between border-t border-border/40 items-center">
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] relative aspect-square md:aspect-[4/5] lg:aspect-[3/4] rounded-[28px] overflow-hidden border border-border/10 flex flex-col justify-end p-6 w-full h-full bg-white dark:bg-ink shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="absolute inset-0 bg-canvas/30 dark:bg-body/5 z-0" />
      <div className="relative z-10 flex flex-col space-y-3.5 w-full">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-7 lg:h-8 w-3/4 rounded mt-1" />
        <div className="space-y-1.5 mt-2">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-5/6 rounded" />
        </div>
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="pt-2 w-full">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
