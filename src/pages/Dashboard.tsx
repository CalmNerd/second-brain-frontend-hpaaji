import { useState, useEffect } from "react"
import { Card } from "../components/ui/Card"
import { Modal } from "../components/ui/Modal"
import type { FormData } from "../components/ui/Modal"
import { Header } from "../components/Header"
import { apiRequest } from "../utils/api"

interface ContentItem {
    _id: string;
    title: string;
    type: 'youtube' | 'x' | 'other';
    tags: string[];
    description: string;
    link?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

interface ContentResponse {
    content: ContentItem[];
}

function Dashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState<FormData[]>([]);
    const [existingTags, setExistingTags] = useState<string[]>(['AI', 'React', 'TypeScript', 'JavaScript', 'Web Development']);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const fetchContent = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            const response: ContentResponse = await apiRequest('/content');
            
            // Transform API data to FormData format
            const transformedItems: FormData[] = response.content.map(item => ({
                title: item.title,
                type: item.type,
                tags: item.tags,
                description: item.description,
                link: item.link
            }));
            
            setItems(transformedItems);
            
            // Extract unique tags from all content
            const allTags = new Set<string>();
            response.content.forEach(item => {
                item.tags.forEach(tag => allTags.add(tag));
            });
            setExistingTags(Array.from(allTags));
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load content');
            console.error('Error fetching content:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch content on component mount
    useEffect(() => {
        fetchContent();
    }, []);

    const handleSubmit = async (data: FormData) => {
        console.log('Form submitted:', data);

        // Add new item to the list
        setItems(prev => [...prev, data]);

        // Add new tags to existing tags if they don't exist
        const newTags = data.tags.filter(tag => !existingTags.includes(tag));
        if (newTags.length > 0) {
            setExistingTags(prev => [...prev, ...newTags]);
        }

        // Refresh content from API to get the latest data
        await fetchContent();
    };

    return (
        <>
            <Header onOpenModal={() => setIsModalOpen(true)} />
            
            {/* Error Display */}
            {error && (
                <div className="mx-4 mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}
            
            {/* Loading State */}
            {isLoading ? (
                <div className="flex items-center justify-center p-8">
                    <div className="text-lg text-gray-600">Loading content...</div>
                </div>
            ) : (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item, index) => (
                        <Card
                            key={index}
                            tags={item.tags}
                            addedOn={new Date().toISOString().split('T')[0]}
                            title={item.title}
                            type={item.type}
                            link={item.link}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                existingTags={existingTags}
            />
        </>
    )
}

export default Dashboard
