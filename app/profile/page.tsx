import FormContainer from '@/components/form/FormContainer';
import {
    updateProfileAction,
    fetchProfile,
    updateProfileImageAction,
} from '@/utils/actions';
import FormInput from '@/components/form/FormInput';
import { SubmitButton } from '@/components/form/Buttons';
import ImageInputContainer from '@/components/form/ImageInputContainer';
import { currentUser } from '@clerk/nextjs/server';
import { Card } from '@/components/ui/card';
async function ProfilePage() {
    const profile = await fetchProfile();
    const user: any = await currentUser();
    const {
        id: orgId,
        code: orgCode,
        name: orgName,
        role: role,
    } = user!.privateMetadata.organization;
    console.log('Profile:21-->role:\n', role);
    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>
                user profile
            </h1>
            <div className='border p-8 rounded-md '>
                <ImageInputContainer
                    image={profile.profileImage}
                    name={profile.username}
                    action={updateProfileImageAction}
                    text='Update Profile Image'
                />
                <FormContainer action={updateProfileAction}>
                    <div className='grid md:grid-cols-2 gap-4 mt-4'>
                        <FormInput
                            type='text'
                            name='firstName'
                            label='First Name'
                            defaultValue={profile.firstName}
                        />
                        <FormInput
                            type='text'
                            name='lastName'
                            label='Last Name'
                            defaultValue={profile.lastName}
                        />
                        <FormInput
                            type='text'
                            name='username'
                            label='Username'
                            defaultValue={profile.username}
                        />
                        <div className='flex flex-col p-2'>
                            <Card className='text-sm text-gray-100 p-4'>
                                <h2 className='text-lg font-semibold'>
                                    Organization
                                </h2>
                                <div className='flex flex-col'>
                                    <span>id: {orgId}</span>
                                    <span>code: {orgCode}</span>
                                    <span>name: {orgName}</span>
                                    <span>role: {role}</span>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <SubmitButton text='update profile' className='mt-8' />
                </FormContainer>
            </div>
        </section>
    );
}
export default ProfilePage;
