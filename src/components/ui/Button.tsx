import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    icon?: React.ReactNode;
}



const variants = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
}

const sizes = {
    small: 'text-sm px-2 py-1',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-6 py-3',
}

const defaultStyles = {
    button: 'button cursor-pointer flex items-center gap-1 rounded-md',
}

export const Button = (props: ButtonProps) => {
    return (
        <button {...props} className={cn(defaultStyles.button, props.className, variants[props.variant || 'primary'], sizes[props.size || 'medium'])}>
            {props.icon}
            {props.children}
        </button>
    )
}