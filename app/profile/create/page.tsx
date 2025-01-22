/* eslint-disable @next/next/no-async-client-component */
'use client';
import { currentUser } from '@clerk/nextjs';
import { UserProfileType } from '@/utils/types';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export default async function CreateProfilePage() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const { toast } = useToast();
    // const { signOut, session } = useClerk();
    //* ---------------------------------
    //* get Clerk user data
    //* ---------------------------------
    const clerkCurrentUser: any = await currentUser();
    const userStatus = clerkCurrentUser?.privateMetadata?.status;
    if (userStatus !== 'active') {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
        toast({
            title: 'Please complete your registration',
            description: formattedDate,
        });
        redirect('/register');
    }
    const primaryEmailAddressId = clerkCurrentUser?.primaryEmailAddressId;
    const clerkPrimaryEmailAddress =
        await clerkCurrentUser?.emailAddresses.find((email: any) => {
            return email.id === primaryEmailAddressId;
        });

    return (
        <section>
            <h1 className='text-2xl font-semibold mb-8 capitalize'>new user</h1>
            <div className='border p-8 rounded-md max-w-lg'>
                <form>
                    <div className='mb-2'>
                        <Label htmlFor='firstName'>First Name</Label>
                        <Input id='firstName' name='firstName' type='text' />
                    </div>
                    <Button type='submit' size='lg'>
                        Create Profile
                    </Button>
                </form>
            </div>
        </section>
    );
}
