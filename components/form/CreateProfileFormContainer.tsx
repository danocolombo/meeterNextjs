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
    jerichoUser: any;
}) {
    const [state, formAction] = useFormState(action, initialState);
    const { toast } = useToast();
    useEffect(() => {
        if (state.message) {
            toast({ description: state.message });
        }
        console.log('FC:25-->useEffect');
    }, [state]);
    return <form action={formAction}>{children}</form>;
}
export default FormContainer;
