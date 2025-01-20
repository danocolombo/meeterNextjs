import { Button } from '@/components/ui/button';
import FormInput from '@/components/form/FormInput';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
const createProfileAction = async (formData: FormData) => {
    'use server';
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    console.log(firstName);
    console.log(lastName);
    console.log(phone);
    redirect('/register/confirmed');
};
const RegisterConfirmedPage = async () => {
    const clerkCurrentUser: any = await currentUser();
    console.log('APS:12--clerkCurrentUser:\n', clerkCurrentUser);

    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>
                Thanks for registering
            </h1>
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
                </form>
            </div>
        </section>
    );
};

export default RegisterConfirmedPage;
