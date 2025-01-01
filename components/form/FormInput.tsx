import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type FormInputProps = {
    name: string;
    type: string;
    label?: string;
    defaultValue?: string;
    readOnly?: boolean;
    placeholder?: string;
    required?: boolean;
};

function FormInput(props: FormInputProps) {
    const {
        label,
        name,
        type,
        defaultValue,
        placeholder,
        readOnly = false,
        required = true,
    } = props;
    return (
        <div className='mb-2'>
            <Label htmlFor={name} className='capitalize'>
                {label || name}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                disabled={readOnly}
                required={required}
            />
        </div>
    );
}
export default FormInput;
