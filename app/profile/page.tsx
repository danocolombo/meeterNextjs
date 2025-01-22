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
    console.log('ap15-->profile:\n', profile);
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
                            name='phone'
                            label='Phone'
                            defaultValue={profile.phone}
                        />
                        <FormInput
                            type='text'
                            name='birthday'
                            label='Birthday'
                            defaultValue={profile.birthday}
                        />
                    </div>
                    <h2 className='text-xl font-semibold mt-2'>
                        System Information
                    </h2>
                    <div className='grid md:grid-cols-1 gap-4 '>
                        <div className='flex p-2'>
                            <div className='flex p-2 w-full'>
                                <Card className='px-4 py-2 w-full'>
                                    <div className='grid md:grid-cols-2 gap-4 text-gray-500'>
                                        <div className='flex flex-col'>
                                            <span className='text-lg font-semibold'>
                                                Personal Information
                                            </span>
                                            <span>
                                                username: {profile.username}
                                            </span>
                                            <span>email: {profile.email}</span>
                                            <span>id: {profile.id}</span>
                                            <span>
                                                clerkId: {profile.clerkId}
                                            </span>
                                            <span>
                                                jerichoId: {profile.jerichoId}
                                            </span>
                                            <span>
                                                cognitoSub: {profile.sub}
                                            </span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-lg font-semibold'>
                                                Organization
                                            </span>
                                            <span>id: {profile.orgId}</span>
                                            <span>code: {profile.orgCode}</span>
                                            <span>name: {profile.orgName}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <SubmitButton text='update profile' className='mt-8' />
                </FormContainer>
            </div>
        </section>
    );
}
export default ProfilePage;
