import { useNavigate } from "react-router-dom"
import { PlusIcon } from "./icons/PlusIcon"
import { ShareIcon } from "./icons/ShareIcon"
import { Button } from "./ui/Button"
import { removeToken } from "../utils/auth"

interface HeaderProps {
    onOpenModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {

    const navigate = useNavigate()
    const handleLogout = () => {
        removeToken();
        alert('Logged out successfully!');
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-between m-4">
            <div className="text-2xl font-bold">All Notes</div>
            <div className="flex items-center gap-2">
                <Button variant="secondary" icon={<ShareIcon />}>Share Brain</Button>
                <Button icon={<PlusIcon />} onClick={onOpenModal}>Add Content</Button>
                <Button variant="secondary" onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    )
}