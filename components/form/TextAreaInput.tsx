import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type TextAreaInputProps = {
    name: string;
    height?: number;
    labelText?: string;
    defaultValue?: string;
    placeholder?: string;
    required?: boolean;
};

function TextAreaInput({
    name,
    labelText,
    defaultValue,
    height = 5,
    placeholder,
    required = true,
}: TextAreaInputProps) {
    return (
        <div className='mb-2'>
            <Label htmlFor={name} className='capitalize'>
                {labelText || name}
            </Label>
            <Textarea
                id={name}
                name={name}
                defaultValue={defaultValue || tempDefaultDescription}
                rows={height}
                required={required}
                className='leading-loose'
                placeholder={placeholder}
            />
        </div>
    );
}

const tempDefaultDescription = '';
export default TextAreaInput;
