'use client';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { actionFunction } from '@/utils/types';

const initialState = {
    message: '',
};

function FormContainer({
    action,
    children,
    className,
}: {
    action: actionFunction;
    children: React.ReactNode;
    className?: string;
}) {
    const [state, formAction] = useFormState(action, initialState);
    const { toast } = useToast();
    useEffect(() => {
        if (state.message) {
            toast({ description: state.message });
        }
    }, [state]);
    return (
        <form action={formAction} className={className}>
            {children}
        </form>
    );
}

export default FormContainer;
