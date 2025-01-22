import { Button } from '@/components/ui/button';
import FormInput from '@/components/form/FormInput';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserProfileType } from '@/utils/types';
const createProfileAction = async (formData: FormData) => {
    'use server';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const clerkId = formData.get('clerkId') as string;
    const email = formData.get('email') as string;
    console.log(firstName);
    console.log(lastName);
    console.log(phone);
    console.log(clerkId);
    console.log(email);
    //* ---------------------------------------------------
    //* save values to the user metadata
    //* ---------------------------------------------------
    let profile: UserProfileType = {
        clerkId: clerkId,
        jerichoId: '0',
        jerichoSub: '0',
        username: '',
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        defaultOrgId: '',
        orgId: '',
        orgCode: '',
        orgName: '',
        roles: [],
        asOf: new Date(),
    };
    console.log('APS:36--profile:\n', profile);
    const postUserMetaResults = await fetch(
        new URL(`/api/users/meta`, baseUrl),
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify({
                clerkId: clerkId,
                status: 'pending',
                apiToken: null,
                userProfile: profile,
            }),
        }
    );
    redirect('/register/confirmed');
};
const RegisterPage = async () => {
    const clerkCurrentUser: any = await currentUser();
    if (clerkCurrentUser?.privateMetadata?.status === 'pending') {
        redirect('/register/confirmed?message=Retry');
        return null;
    }
    // console.log('APS:12--clerkCurrentUser:\n', clerkCurrentUser);

    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>
                registration page
            </h1>
            <div className='p-4 max-w-lg'>
                <p>
                    Please fill out the form below and submit your request. Your
                    request will be reviewed and action taken.
                </p>
            </div>
            <div className='border p-8 rounded-md max-w-lg'>
                <form action={createProfileAction}>
                    <div className='flex flex-row mb-2 space-x-4'>
                        <FormInput
                            name='firstName'
                            label='First Name'
                            type='text'
                            defaultValue={clerkCurrentUser?.firstName}
                        />
                        <FormInput
                            name='lastName'
                            label='Last Name'
                            type='text'
                            defaultValue={clerkCurrentUser?.lastName}
                        />
                    </div>
                    <div className='flex flex-row mb-2 space-x-4'>
                        <FormInput name='phone' label='Phone' type='text' />
                    </div>
                    <div className='mb-2'></div>
                    <Button type='submit' size='lg'>
                        Create Profile
                    </Button>
                    <input
                        type='hidden'
                        name='clerkId'
                        value={clerkCurrentUser?.id}
                    />
                    <input
                        type='hidden'
                        name='email'
                        value={
                            clerkCurrentUser?.emailAddresses.find(
                                (item: any) =>
                                    item.id ===
                                    clerkCurrentUser?.primaryEmailAddressId
                            )?.emailAddress
                        }
                    />
                </form>
            </div>
        </section>
    );
};

export default RegisterPage;
