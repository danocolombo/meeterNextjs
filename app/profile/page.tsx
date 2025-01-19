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
import { fetchProfileImage } from '@/utils/clerk';
async function ProfilePage() {
    const clerkCurrentUser: any = await currentUser();
    const profileImage = await fetchProfileImage();
    const profile = clerkCurrentUser.privateMetadata.meeter;
    console.log('ap15-->clerkCurrentUser:\n', clerkCurrentUser);
    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>
                user profile
            </h1>
            <div className='border p-8 rounded-md '>
                <ImageInputContainer
                    image={profileImage}
                    name={clerkCurrentUser.username}
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
                                    <span>id: {profile.orgId}</span>
                                    <span>code: {profile.orgCode}</span>
                                    <span>name: {profile.orgName}</span>
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
