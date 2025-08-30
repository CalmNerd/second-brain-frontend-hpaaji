import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    icon?: React.ReactNode;
}

export const Button = (props: ButtonProps) => {
    return (
        <button {...props} className={cn('button', props.className)}>
            {props.children}
        </button>
    )
}