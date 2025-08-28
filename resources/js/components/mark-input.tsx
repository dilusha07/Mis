import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';
import { MarkItem } from '@/types';

interface MarkInputProps {
    mark: MarkItem;
    index: number;
    showName?: boolean;
    isView?: boolean;
    canRemove?: boolean;
    onUpdate: (index: number, field: 'name' | 'marks', value: string | number) => void;
    onRemove?: (index: number) => void;
}

export default function MarkInput({
    mark,
    index,
    showName = false,
    isView = false,
    canRemove = false,
    onUpdate,
    onRemove
}: MarkInputProps) {
    return (
        <div className="flex gap-2">
            {showName && (
                <Input
                    placeholder="Mark name"
                    value={mark.name}
                    onChange={(e) => onUpdate(index, 'name', e.target.value)}
                    disabled={isView}
                    className="flex-1"
                />
            )}
            <Input
                type="number"
                placeholder="Marks"
                value={mark.marks}
                onChange={(e) => onUpdate(index, 'marks', parseInt(e.target.value) || 0)}
                disabled={isView}
                className={showName ? "w-24" : "w-32"}
                min="0"
                max="100"
            />
            {!isView && canRemove && onRemove && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(index)}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
