import { Button } from '@/components/ui/button';
import FormInput from '@/components/form/FormInput';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserProfileType } from '@/utils/types';
const createProfileAction = async (formData: FormData) => {
    ('use server');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const clerkId = formData.get('clerkId') as string;
    const email = formData.get('email') as string;

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
        defaultOrgId: '',
        orgId: '',
        orgCode: '',
        orgName: '',
        roles: [],
        asOf: new Date(),
    };

    const postUserMetaResults = await fetch(
        new URL(`/api/users/meta`, baseUrl),
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify({
                status: 'pending',
                meeter: profile,
            }),
        }
    );
    const userMetaResponse: any = await postUserMetaResults.json();
    if (userMetaResponse.status !== 200) {
        console.log('userMetaResponse:', userMetaResponse);
        console.log('APC:77--ERROR postUserMetaResults !== 200 [apc:77]');
    }
    const userMeta = await userMetaResponse.privateMetadata;
    console.log('APC:81--userMeta:\n', userMeta);
    redirect('/register/confirmed');
};
const RegisterPage = async () => {
    const clerkCurrentUser: any = await currentUser();
    // console.log('APS:12--clerkCurrentUser:\n', clerkCurrentUser);

    return (
        <section>
            <h1 className='text-2xl font-semibold mb-2 capitalize'>
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
                        Register
                    </Button>
                    <input
                        type='hidden'
                        name='clerkId'
                        value={clerkCurrentUser?.id}
                    />
                    <input
                        type='hidden'
                        name='email'
                        value={clerkCurrentUser?.email}
                    />
                </form>
            </div>
        </section>
    );
};

export default RegisterPage;
