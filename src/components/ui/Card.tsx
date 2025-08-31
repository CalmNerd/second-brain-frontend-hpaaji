import { cn } from "../../lib/utils";

export interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className }: CardProps) => {
    return (
        <div className={cn('card',
            'rounded-md shadow-sm border border-gray-200 p-4',
            className
        )}>
            {children}
        </div>
    )
}