import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/api";
import { Button } from "./Button";

interface ShareResponse {
    message: string;
    hash: string;
}

export const ShareBrainModal = (props: { isOpen: boolean, onClose: () => void }) => {
    const [isShareLoading, setIsShareLoading] = useState(false);
    const [isRevokeLoading, setIsRevokeLoading] = useState(false);
    const [shareResult, setShareResult] = useState<ShareResponse | null>(null);
    const [isRevoked, setIsRevoked] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Reset modal state when modal opens
    useEffect(() => {
        if (props.isOpen) {
            handleOpen();
        }
    }, [props.isOpen]);

    // Handle share brain request
    const handleShareBrain = async () => {
        try {
            setIsShareLoading(true);
            const response: ShareResponse = await apiRequest('/brain/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'share': true
                })
            });
            setShareResult(response);
            setIsRevoked(false);
        } catch (error) {
            console.error('Error sharing brain:', error);
            alert('Failed to share brain. Please try again.');
        } finally {
            setIsShareLoading(false);
        }
    };

    // Handle revoke brain request
    const handleRevokeBrain = async () => {
        try {
            setIsRevokeLoading(true);
            await apiRequest('/brain/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'share': false
                })
            });
            setIsRevoked(true);
            setShareResult(null);
        } catch (error) {
            console.error('Error revoking brain:', error);
            alert('Failed to revoke brain. Please try again.');
        } finally {
            setIsRevokeLoading(false);
        }
    };

    // Handle copy to clipboard
    const handleCopyLink = async () => {
        if (shareResult?.hash) {
            const link = `http://localhost:5173/share/${shareResult.hash}`;
            try {
                await navigator.clipboard.writeText(link);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            } catch (error) {
                console.error('Failed to copy link:', error);
                alert('Failed to copy link to clipboard');
            }
        }
    };

    // Reset modal state when closing
    const handleClose = () => {
        setShareResult(null);
        setIsRevoked(false);
        setCopySuccess(false);
        setIsShareLoading(false);
        setIsRevokeLoading(false);
        props.onClose();
    };

    // Reset modal state when opening
    const handleOpen = () => {
        setShareResult(null);
        setIsRevoked(false);
        setCopySuccess(false);
        setIsShareLoading(false);
        setIsRevokeLoading(false);
    };

    // Don't render if modal is not open
    if (!props.isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                {/* Initial View - Share/Revoke Options */}
                {!shareResult && !isRevoked && (
                    <>
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Share your brain?</h2>
                            <span className="text-gray-600 px-2 opacity-50 hover:opacity-100 cursor-pointer text-2xl"
                                onClick={handleClose}
                            >
                                ×
                            </span>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Share your brain to allow others to view your content. You can revoke access at any time.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleShareBrain}
                                disabled={isShareLoading || isRevokeLoading}
                                className="flex-1"
                            >
                                {isShareLoading ? 'Sharing...' : 'Share'}
                            </Button>
                            <Button
                                onClick={handleRevokeBrain}
                                disabled={isShareLoading || isRevokeLoading}
                                variant="secondary"
                                className="flex-1"
                            >
                                {isRevokeLoading ? 'Revoking...' : 'Revoke'}
                            </Button>
                        </div>
                    </>
                )}

                {/* Result View - After Share */}
                {shareResult && !isRevoked && (
                    <>
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Brain Shared Successfully!</h2>
                            <span className="text-gray-600 px-2 opacity-50 hover:opacity-100 cursor-pointer text-2xl"
                                onClick={handleClose}
                            >
                                ×
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">{shareResult.message}</p>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-600 mb-2">Share this link:</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={`http://localhost:5173/share/${shareResult.hash}`}
                                    readOnly
                                    className="flex-1 p-2 border border-gray-300 rounded text-sm bg-white"
                                />
                                <Button
                                    onClick={handleCopyLink}
                                    variant="secondary"
                                    className="px-3 py-2 text-sm"
                                >
                                    {copySuccess ? 'Copied!' : 'Copy'}
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleRevokeBrain}
                                disabled={isShareLoading || isRevokeLoading}
                                variant="secondary"
                                className="flex-1"
                            >
                                {isRevokeLoading ? 'Revoking...' : 'Revoke Access'}
                            </Button>
                        </div>
                    </>
                )}

                {/* Result View - After Revoke */}
                {isRevoked && (
                    <>
                        <div className="flex justify-between items-start">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Access Revoked</h2>
                            <span className="text-gray-600 px-2 opacity-50 hover:opacity-100 cursor-pointer text-2xl"
                                onClick={handleClose}
                            >
                                ×
                            </span>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Your brain is no longer shared. The previous link is no longer accessible.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleShareBrain}
                                disabled={isShareLoading || isRevokeLoading}
                                className="flex-1"
                            >
                                {isShareLoading ? 'Sharing...' : 'Share Again'}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};