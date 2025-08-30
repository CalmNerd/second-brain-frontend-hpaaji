import { cn } from "../../lib/utils";

export interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className }: CardProps) => {
    return (
        <div className={cn('card', className)}>{children}</div>
    )
}