export const Badge = ({ children }: { children: string }) => {
    return (
        <div className="bg-indigo-100 text-indigo-900 rounded-lg px-1 text-xs w-fit">#{children}</div>
    )
}