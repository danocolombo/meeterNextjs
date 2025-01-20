import { Button } from '@/components/ui/button';
import FormInput from '@/components/form/FormInput';
const createProfileAction = async (formData: FormData) => {
    'use server';
    const firstName = formData.get('firstName') as string;
    console.log(firstName);
};

function CreateProfile() {
    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>new user</h1>
            <div className='border p-8 rounded-md max-w-lg'>
                <form action={createProfileAction}>
                    <div className='flex flex-row mb-2 space-x-4'>
                        <FormInput
                            name='firstName'
                            label='First Name'
                            type='text'
                        />
                        <FormInput
                            name='lastName'
                            label='Last Name'
                            type='text'
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
}
export default CreateProfile;
