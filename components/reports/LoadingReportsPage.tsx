import { Skeleton } from '@/components/ui/skeleton';

function LoadingReportsPage() {
    return (
        <section className='mt-4 gap-8 grid sm:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4'>
            <SkeletonCard />
        </section>
    );
}

export function SkeletonCard() {
    return (
        <div className='w-full'>
            <Skeleton className='h-[300px] w-full rounded-md' />
        </div>
    );
}

export default LoadingReportsPage;
