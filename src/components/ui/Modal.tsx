import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { apiRequest } from '../../utils/api';

// Types for the form data
export interface FormData {
    title: string;
    type: 'youtube' | 'x' | 'other';
    tags: string[];
    description: string;
    link?: string;
}

// Props for the Modal component
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
    existingTags?: string[]; // Tags that already exist in the database
    initialData?: Partial<FormData>; // For editing existing items
}

// Component for handling list items in description
const ListItemInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
    onRemove: () => void;
    index: number;
}> = ({ value, onChange, onRemove, index }) => (
    <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm w-6">•</span>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={`List item ${index + 1}`}
        />
        <Button
            variant="secondary"
            size="small"
            onClick={onRemove}
            className="text-red-600 hover:bg-red-50"
        >
            Remove
        </Button>
    </div>
);

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    existingTags = [],
    initialData
}) => {
    // Form state
    const [formData, setFormData] = useState<FormData>({
        title: '',
        type: 'other',
        tags: [],
        description: '',
        link: '',
        ...initialData
    });

    // Tag search state
    const [tagSearch, setTagSearch] = useState('');
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [newTag, setNewTag] = useState('');

    // Description list state
    const [listItems, setListItems] = useState<string[]>([]);
    const [isListMode, setIsListMode] = useState(false);

    // Loading and error states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Refs
    const modalRef = useRef<HTMLDivElement>(null);
    const tagInputRef = useRef<HTMLInputElement>(null);

    // Filter existing tags based on search
    const filteredTags = existingTags.filter(tag =>
        tag.toLowerCase().includes(tagSearch.toLowerCase()) &&
        !formData.tags.includes(tag)
    );

    // Handle form field changes
    const handleInputChange = (field: keyof FormData, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle tag addition
    const handleAddTag = (tag: string) => {
        if (tag.trim() && !formData.tags.includes(tag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag.trim()]
            }));
        }
        setTagSearch('');
        setNewTag('');
        setShowTagSuggestions(false);
    };

    // Handle tag removal
    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Handle list item addition
    const handleAddListItem = () => {
        setListItems(prev => [...prev, '']);
    };

    // Handle list item change
    const handleListItemChange = (index: number, value: string) => {
        setListItems(prev => {
            const newItems = [...prev];
            newItems[index] = value;
            return newItems;
        });
    };

    // Handle list item removal
    const handleRemoveListItem = (index: number) => {
        setListItems(prev => prev.filter((_, i) => i !== index));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset error state
        setError('');
        setIsLoading(true);
        
        try {
            // Combine description with list items if in list mode
            let finalDescription = formData.description;
            if (isListMode && listItems.length > 0) {
                const listText = listItems
                    .filter(item => item.trim())
                    .map(item => `• ${item}`)
                    .join('\n');
                finalDescription = finalDescription + (finalDescription ? '\n\n' : '') + listText;
            }

            const submitData: FormData = {
                ...formData,
                description: finalDescription
            };

            // Use the API service to submit content
            await apiRequest('/content', {
                method: 'POST',
                body: JSON.stringify(submitData)
            });

            // Show success alert
            alert('Content added successfully!');
            
            // Call the onSubmit callback
            onSubmit(submitData);
            
            // Close the modal
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add content. Please try again.');
            console.error('Content submission error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle modal close
    const handleClose = () => {
        setFormData({
            title: '',
            type: 'other',
            tags: [],
            description: '',
            link: ''
        });
        setTagSearch('');
        setNewTag('');
        setListItems([]);
        setIsListMode(false);
        setShowTagSuggestions(false);
        setError('');
        setIsLoading(false);
        onClose();
    };

    // Handle click outside modal
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div 
                ref={modalRef}
                className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {initialData ? 'Edit Item' : 'Add New Item'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 cursor-pointer hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Title Field */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            required
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter title..."
                        />
                    </div>

                    {/* Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type *
                        </label>
                        <div className="flex gap-4">
                            {[
                                { value: 'youtube', label: 'YouTube', icon: '🎥' },
                                { value: 'x', label: 'X (Twitter)', icon: '🐦' },
                                { value: 'other', label: 'Other', icon: '📄' }
                            ].map((type) => (
                                <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type.value}
                                        checked={formData.type === type.value}
                                        onChange={(e) => handleInputChange('type', e.target.value as FormData['type'])}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-lg">{type.icon}</span>
                                    <span className="text-sm">{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* URL Field (conditional based on type) */}
                    {/* {(formData.type === 'youtube' || formData.type === 'x') && (
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                                URL *
                            </label>
                            <input
                                type="url"
                                id="url"
                                required
                                value={formData.url || ''}
                                onChange={(e) => handleInputChange('url', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder={`Enter ${formData.type === 'youtube' ? 'YouTube' : 'X'} URL...`}
                            />
                        </div>
                    )} */}

                    {/* Link Field */}
                    <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                            Link
                        </label>
                        <input
                            type="url"
                            id="link"
                            value={formData.link || ''}
                            onChange={(e) => handleInputChange('link', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter any additional link..."
                        />
                    </div>

                    {/* Tags Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags
                        </label>
                        <div className="relative">
                            <input
                                ref={tagInputRef}
                                type="text"
                                value={tagSearch}
                                onChange={(e) => {
                                    setTagSearch(e.target.value);
                                    setShowTagSuggestions(true);
                                }}
                                onFocus={() => setShowTagSuggestions(true)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Search or add new tags..."
                            />
                            
                            {/* Tag Suggestions */}
                            {showTagSuggestions && (tagSearch || filteredTags.length > 0) && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {/* Existing tags */}
                                    {filteredTags.map((tag) => (
                                        <div
                                            key={tag}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleAddTag(tag)}
                                        >
                                            {tag}
                                        </div>
                                    ))}
                                    
                                    {/* New tag option */}
                                    {tagSearch && !existingTags.includes(tagSearch) && (
                                        <div
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-indigo-600 font-medium"
                                            onClick={() => handleAddTag(tagSearch)}
                                        >
                                            + Add "{tagSearch}" as new tag
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* Selected Tags */}
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.tags.map((tag) => (
                                    <div key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-900 rounded-lg px-2 py-1 text-xs">
                                        <span>#{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="text-red-600 hover:text-red-800 text-sm ml-1"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        
                        {/* Description Mode Toggle */}
                        <div className="flex gap-2 mb-3">
                            <Button
                                type="button"
                                variant={!isListMode ? 'primary' : 'secondary'}
                                size="small"
                                onClick={() => setIsListMode(false)}
                            >
                                Text Mode
                            </Button>
                            <Button
                                type="button"
                                variant={isListMode ? 'primary' : 'secondary'}
                                size="small"
                                onClick={() => setIsListMode(true)}
                            >
                                List Mode
                            </Button>
                        </div>

                        {!isListMode ? (
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter description..."
                            />
                        ) : (
                            <div className="space-y-3">
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter description (optional)..."
                                />
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">List Items</span>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="small"
                                            onClick={handleAddListItem}
                                        >
                                            Add Item
                                        </Button>
                                    </div>
                                    
                                    {listItems.map((item, index) => (
                                        <ListItemInput
                                            key={index}
                                            value={item}
                                            onChange={(value) => handleListItemChange(index, value)}
                                            onRemove={() => handleRemoveListItem(index)}
                                            index={index}
                                        />
                                    ))}
                                    
                                    {listItems.length === 0 && (
                                        <p className="text-sm text-gray-500 italic">
                                            Click "Add Item" to start creating a list
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adding...' : (initialData ? 'Update' : 'Submit')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};