import { Button } from '@/components/ui/button';
import FormInput from '@/components/form/FormInput';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
const createProfileAction = async (formData: FormData) => {
    'use server';
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    console.log(firstName);
    console.log(lastName);
    console.log(phone);
    redirect('/register/confirmed');
};
const RegisterConfirmedPage = async () => {
    const clerkCurrentUser: any = await currentUser();
    // console.log('APS:12--clerkCurrentUser:\n', clerkCurrentUser);

    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>
                Thanks for registering
            </h1>
            <div className='p-2 max-w-lg'>
                <p>
                    Thank you, {clerkCurrentUser?.firstName}, for completing
                    your registration request. The Meeter admins will review
                    your request and take proper action and notifying you if
                    your request is approved.
                </p>
            </div>
            <div className='p-2 max-w-lg'>
                <p>
                    Notification will be sent to
                    <b>
                        {' '}
                        {
                            clerkCurrentUser?.emailAddresses.find(
                                (item: any) =>
                                    item.id ===
                                    clerkCurrentUser?.primaryEmailAddressId
                            )?.emailAddress
                        }
                    </b>
                </p>
            </div>
        </section>
    );
};

export default RegisterConfirmedPage;
