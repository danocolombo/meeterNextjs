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
    jerichoUser,
}: {
    action: actionFunction;
    children: React.ReactNode;
    jerichoUser?: any;
}) {
    const wrappedAction = (prevState: any, formData: FormData) =>
        jerichoUser
            ? action(prevState, formData, jerichoUser)
            : action(prevState, formData);
    const [state, formAction] = useFormState(action, initialState);
    const { toast } = useToast();
    useEffect(() => {
        if (state.message) {
            toast({ description: state.message });
        }
    }, [state, toast]);
    return <form action={formAction}>{children}</form>;
}
export default FormContainer;
