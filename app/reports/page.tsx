import FormContainer from '@/components/form/FormContainer';
import { updateProfileAction, updateProfileImageAction } from '@/utils/actions';
import FormInput from '@/components/form/FormInput';
import { SubmitButton } from '@/components/form/Buttons';
import ImageInputContainer from '@/components/form/ImageInputContainer';
import { currentUser } from '@clerk/nextjs/server';
import { Card } from '@/components/ui/card';
import { fetchProfileImage } from '@/utils/clerk';
import { printObject } from '@/utils/helpers';
async function ReportsPage() {
    const clerkCurrentUser: any = await currentUser();
    const profileImage = await fetchProfileImage();
    const profile = clerkCurrentUser?.privateMetadata?.meeter || {};
    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>Reports</h1>
        </section>
    );
}
export default ReportsPage;
