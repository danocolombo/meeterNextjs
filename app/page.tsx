import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import MeetingList from '@/components/meetings/meetingList';
import { printObject } from '@/utils/helpers';
// import { getSession } from '@/utils/jose';
const HomePage = async () => {
    let DEV = true;
    const platformValue = process.env.NEXT_PUBLIC_MEETER_PLATFORM || 'DEV';
    if (platformValue === 'PROD') {
        DEV = false;
    }
    const clerkCurrentUser: any = await currentUser();
    // DEV
    //     ? printObject('🔲🔲🔲🔲🔲 p:8-->clerkCurrentUser:\n', clerkCurrentUser)
    //     : null;
    /* the clerk metadata might be returned, but that does not mean that the user is logged in */

    return (
        <>
            {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}

            {clerkCurrentUser?.privateMetadata?.meeter?.apiToken ? (
                <div>
                    <p className='text-lg'>
                        Welcome {clerkCurrentUser?.firstName}
                    </p>
                    <MeetingList />
                </div>
            ) : (
                <div>
                    <p>Please login</p>
                </div>
            )}
        </>
    );
};
export default HomePage;
