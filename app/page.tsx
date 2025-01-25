import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import MeetingList from '@/components/meetings/meetingList';
// import { getSession } from '@/utils/jose';
const HomePage = async () => {
    const clerkCurrentUser: any = await currentUser();
    const profile = clerkCurrentUser?.privateMetadata?.meeter;
    // const session = await getSession();
    return (
        <>
            {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}

            {profile ? (
                <div>
                    <p className='text-lg'>Welcome {profile?.firstName}</p>
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
