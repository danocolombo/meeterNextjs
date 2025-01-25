import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import MeetingList from '@/components/meetings/meetingList';
import { printObject } from '@/utils/helpers';
// import { getSession } from '@/utils/jose';
const HomePage = async () => {
    const clerkCurrentUser: any = await currentUser();
    // printObject('p:8-->clerkCurrentUser:\n', clerkCurrentUser);

    return (
        <>
            {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}

            {clerkCurrentUser?.privateMetadata ? (
                <div>
                    <p className='text-lg'>
                        Welcome {clerkCurrentUser?.firstName}
                    </p>
                    <MeetingList
                        apiToken={
                            clerkCurrentUser.privateMetadata?.meeter?.apiToken
                        }
                    />
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
