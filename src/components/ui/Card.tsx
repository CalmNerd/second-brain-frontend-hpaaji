import { cn } from "../../lib/utils";
import { Badge } from "./Badge";

export interface CardProps {
    icon: React.ReactNode;
    className?: string;
    tags?: string[];
    addedOn?: string;
    title?: string;
    videoUrl?: string;
    postUrl?: string;
}

export const Card = ({ className, icon, tags, addedOn, title, videoUrl, postUrl }: CardProps) => {
    return (
        <div className={cn('card',
            'rounded-md border border-gray-200 p-4 max-w-72',
            className
        )}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {icon}
                        <span>
                            {title}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {icon}
                        {icon}
                    </div>
                </div>
                <div className="aspect-w-16 aspect-h-9 w-full">
                    {videoUrl && (
                        <iframe
                            width="100%"
                            height="100%"
                            src={videoUrl?.replace('watch?v=', 'embed/')}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}

                    {postUrl && (
                        <div>
                            {postUrl}
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-wrap gap-1">
                    {tags?.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                    ))}
                </div>
                <div className="w-full text-xs text-gray-400">Added on {addedOn}</div>
            </div>
        </div>
    )
}