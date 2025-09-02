import { cn } from "../../lib/utils";
import { Badge } from "./Badge";
import { DeleteIcon } from "../icons/DeleteIcon";

export interface CardProps {
    className?: string;
    tags?: string[];
    title?: string;
    type?: 'youtube' | 'x' | 'other';
    link?: string;
    onDelete?: () => void;
    createdAt?: string;
}

export const Card = ({ className, tags, title, type, link, onDelete, createdAt }: CardProps) => {
    return (
        <div className={cn('card',
            'rounded-lg border border-gray-200 p-4 max-w-72',
            className
        )}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {type === "youtube" ? "📺" : type === "x" ? "🐦" : "🔗"}
                        <span>
                            {title}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <ShareIcon /> */}
                        <span onClick={onDelete} className="cursor-pointer opacity-50 hover:opacity-100">
                            <DeleteIcon />
                        </span>
                    </div>
                </div>
                <div className="aspect-w-16 aspect-h-9 w-full">
                    {type === 'youtube' && (
                        <iframe
                            width="100%"
                            height="100%"
                            src={link?.replace('watch?v=', 'embed/')}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}

                    {type === 'x' && (
                        <div className="break-words">
                            {link}
                        </div>
                    )}

                    {type === 'other' && (
                        <div className="mt-2 break-words">
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                            >
                                🔗 Additional Link
                            </a>
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-wrap gap-1">
                    {tags?.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                    ))}
                </div>
                <div className="w-full text-xs text-gray-400">Added on {createdAt}</div>
            </div>
        </div>
    )
}