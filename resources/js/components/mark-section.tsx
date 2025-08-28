import React from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Plus } from 'lucide-react';
import MarkInput from './mark-input';
import { MarkItem } from '@/types';

interface MarkSectionProps {
    title: string;
    marks: MarkItem[];
    setMarks: React.Dispatch<React.SetStateAction<MarkItem[]>>;
    isView?: boolean;
    showName?: boolean;
}

export default function MarkSection({ title, marks, setMarks, isView = false, showName = false }: MarkSectionProps) {
    const addMark = () => {
        setMarks([...marks, { name: '', marks: 0 }]);
    };

    const removeMark = (index: number) => {
        if (marks.length > 1) {
            setMarks(marks.filter((_, i) => i !== index));
        }
    };

    const updateMark = (index: number, field: 'name' | 'marks', value: string | number) => {
        const newMarks = [...marks];
        newMarks[index] = { ...newMarks[index], [field]: value };
        setMarks(newMarks);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>{title}</Label>
                {!isView && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addMark}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                    </Button>
                )}
            </div>
            <div className="space-y-2">
                {marks.map((mark, index) => (
                    <MarkInput
                        key={index}
                        mark={mark}
                        index={index}
                        showName={showName}
                        isView={isView}
                        canRemove={marks.length > 1}
                        onUpdate={updateMark}
                        onRemove={removeMark}
                    />
                ))}
            </div>
        </div>
    );
}
