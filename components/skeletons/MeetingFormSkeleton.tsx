import { Skeleton } from '@/components/ui/skeleton';

const MeetingFormSkeleton = () => {
    return (
        <div className='space-y-6 p-4'>
            <Skeleton className='h-8 w-[250px]' />
            <div className='space-y-4'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-20 w-full' />
            </div>
        </div>
    );
};

export default MeetingFormSkeleton;
