import { Button } from '@/components/ui/button';
import { getSession } from '@/utils/session';
const HomePage = async () => {
    const session = await getSession();
    return (
        <>
            <div>
                <h1 className='text-3xl'>Meeter</h1>
            </div>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
    );
};
export default HomePage;
