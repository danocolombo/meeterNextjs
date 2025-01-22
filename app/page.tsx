import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
// import { getSession } from '@/utils/jose';
const HomePage = async () => {
    const clerkCurrentUser: any = await currentUser();
    const profile = clerkCurrentUser?.privateMetadata?.meeter;
    console.log('APC:27--clerkCurrentUser:\n', clerkCurrentUser);
    // const session = await getSession();
    return (
        <>
            <div>
                <h1 className='text-3xl'>Meeter</h1>
            </div>
            {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}

            {profile ? (
                <div>
                    <p className='text-lg'>Welcome {profile?.firstName}</p>
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
