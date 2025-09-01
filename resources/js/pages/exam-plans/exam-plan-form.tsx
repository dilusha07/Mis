import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Types
type MarkItem = {
    name: string;
    marks: number;
};

type ExamPlan = {
    id: number;
    first_examiner_id: number;
    second_examiner_id: number;
    department_id: number;
    module_id: number;
    final_marks: string | MarkItem[];
    mid_marks: string | MarkItem[];
    ca_marks: string | MarkItem[];
    other_marks: string | MarkItem[];
};

type Lecturer = {
    id: number;
    full_name: string;
    department_id: number;
};

type Department = {
    id: number;
    dept_name: string;
};

type Module = {
    id: number;
    module_name: string;
    module_code: string;
    department_id: number;
};

type ExamPlanFormProps = {
    examPlan?: ExamPlan;
    isView?: boolean;
    isEdit?: boolean;
    lecturers: Lecturer[];
    departments: Department[];
    modules: Module[];
};

// Components
const MarksSection = ({
    title,
    marks,
    onMarkChange,
    onAddMark,
    onRemoveMark,
    isView,
    showAddRemove = true,
    showName = true,
}: {
    title: string;
    marks: MarkItem[];
    onMarkChange: (index: number, mark: MarkItem) => void;
    onAddMark?: () => void;
    onRemoveMark?: (index: number) => void;
    isView: boolean;
    showAddRemove?: boolean;
    showName?: boolean;
}) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <Label>{title}</Label>
            {showAddRemove && !isView && onAddMark && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onAddMark}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                </Button>
            )}
        </div>
        <div className="space-y-2">
            {marks.map((mark, index) => (
                <div key={index} className="flex gap-2">
                    <MarkInput
                        mark={mark}
                        onChange={(newMark) => onMarkChange(index, newMark)}
                        isView={isView}
                        showName={showName}
                    />
                    {showAddRemove && !isView && onRemoveMark && marks.length > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onRemoveMark(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const MarkInput = ({
    mark,
    onChange,
    isView,
    showName = false
}: {
    mark: MarkItem;
    onChange: (value: MarkItem) => void;
    isView: boolean;
    showName?: boolean;
}) => (
    <div className="flex gap-2">
        {showName && (
            <Input
                placeholder="Mark name"
                value={mark.name}
                onChange={(e) => onChange({ ...mark, name: e.target.value })}
                disabled={isView}
                className="flex-1"
            />
        )}
        <Input
            type="number"
            placeholder="Marks"
            value={mark.marks || ''}
            onChange={(e) => {
                const value = e.target.value === '' ? 0 : Number(e.target.value);
                onChange({ ...mark, marks: value });
            }}
            disabled={isView}
            className={showName ? "w-24" : "w-32"}
            min="0"
            max="100"
        />
    </div>
);

export default function ExamPlanForm({ examPlan, isView, isEdit, lecturers, departments, modules }: ExamPlanFormProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Exam Plan`,
            href: route('exam-plans.create'),
        },
    ];

    // Helper functions
    const parseMarks = (marks: string | MarkItem[] | undefined, defaultName?: string): MarkItem[] => {
        if (!marks) return [{ name: defaultName || '', marks: 0 }];
        return typeof marks === 'string' ? JSON.parse(marks) : marks;
    };

    // Mark state management
    const [finalMarks, setFinalMarks] = useState<MarkItem[]>(parseMarks(examPlan?.final_marks, 'Final'));
    const [midMarks, setMidMarks] = useState<MarkItem[]>(parseMarks(examPlan?.mid_marks, 'Mid'));
    const [caMarks, setCaMarks] = useState<MarkItem[]>(parseMarks(examPlan?.ca_marks));
    const [otherMarks, setOtherMarks] = useState<MarkItem[]>(parseMarks(examPlan?.other_marks));

    // Mark section handlers
    const handleMarkChange = (
        marks: MarkItem[],
        setMarks: React.Dispatch<React.SetStateAction<MarkItem[]>>,
        index: number,
        newMark: MarkItem
    ) => {
        const newMarks = [...marks];
        newMarks[index] = newMark;
        setMarks(newMarks);
    };

    const handleAddMark = (
        marks: MarkItem[],
        setMarks: React.Dispatch<React.SetStateAction<MarkItem[]>>
    ) => {
        setMarks([...marks, { name: '', marks: 0 }]);
    };

    const handleRemoveMark = (
        marks: MarkItem[],
        setMarks: React.Dispatch<React.SetStateAction<MarkItem[]>>,
        index: number
    ) => {
        if (marks.length > 1) {
            setMarks(marks.filter((_, i) => i !== index));
        }
    };

    interface FormData {
        first_examiner_id: string;
        second_examiner_id: string;
        department_id: string;
        module_id: string;
        final_marks: MarkItem[];
        mid_marks: MarkItem[];
        ca_marks: MarkItem[];
        other_marks: MarkItem[];
        _method: 'PUT' | 'POST';
    }

    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        first_examiner_id: examPlan?.first_examiner_id?.toString() ?? '',
        second_examiner_id: examPlan?.second_examiner_id?.toString() ?? '',
        department_id: examPlan?.department_id?.toString() ?? '',
        module_id: examPlan?.module_id?.toString() ?? '',
        final_marks: finalMarks,
        mid_marks: midMarks,
        ca_marks: caMarks,
        other_marks: otherMarks,
        _method: isEdit ? 'PUT' : 'POST',
    });

    // Update form data when marks change
    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            final_marks: finalMarks,
            mid_marks: midMarks,
            ca_marks: caMarks,
            other_marks: otherMarks
        }));
    }, [finalMarks, midMarks, caMarks, otherMarks]);

    // Handle department change
    const handleDepartmentChange = (value: string) => {
        setData((prevData) => ({
            ...prevData,
            department_id: value,
            module_id: ''
        }));
    };

    const addMarkItem = (marksArray: MarkItem[], setMarksArray: React.Dispatch<React.SetStateAction<MarkItem[]>>) => {
        setMarksArray([...marksArray, { name: '', marks: 0 }]);
    };

    const removeMarkItem = (marksArray: MarkItem[], setMarksArray: React.Dispatch<React.SetStateAction<MarkItem[]>>, index: number) => {
        if (marksArray.length > 1) {
            setMarksArray(marksArray.filter((_, i) => i !== index));
        }
    };

    const updateMarkItem = (
        marksArray: MarkItem[],
        setMarksArray: React.Dispatch<React.SetStateAction<MarkItem[]>>,
        index: number,
        field: 'name' | 'marks',
        value: string | number
    ) => {
        const newMarks = [...marksArray];
        newMarks[index] = { ...newMarks[index], [field]: value };
        setMarksArray(newMarks);
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && examPlan?.id) {
            put(route('exam-plans.update', examPlan.id));
        } else {
            post(route('exam-plans.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Exam Plan`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                        href={route('exam-plans.index')}
                    >
                        <ArrowLeft className="me-2" /> Back to Exam Plans
                    </Link>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{isView ? 'Show' : isEdit ? 'Update' : 'Create'} Exam Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="first_examiner_id">First Examiner *</Label>
                                    <Select
                                        value={data.first_examiner_id.toString()}
                                        onValueChange={(value) => setData('first_examiner_id', value)}
                                        disabled={isView}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select first examiner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lecturers.map((lecturer) => (
                                                <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                                                    {lecturer.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.first_examiner_id} />
                                </div>

                                {/* Second Examiner */}
                                <div className="space-y-2">
                                    <Label htmlFor="second_examiner_id">Second Examiner *</Label>
                                    <Select
                                        value={data.second_examiner_id.toString()}
                                        onValueChange={(value) => setData('second_examiner_id', value)}
                                        disabled={isView}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select second examiner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lecturers.map((lecturer) => (
                                                <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                                                    {lecturer.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.second_examiner_id} className="mt-1" />
                                </div>

                                {/* Department */}
                                <div className="space-y-2">
                                    <Label htmlFor="department_id">Department *</Label>
                                    <Select
                                        value={data.department_id.toString()}
                                        onValueChange={handleDepartmentChange}
                                        disabled={isView}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                                    {dept.dept_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.department_id} className="mt-1" />
                                </div>

                                {/* Module */}
                                <div className="space-y-2">
                                    <Label htmlFor="module_id">Module *</Label>
                                    <Select
                                        value={data.module_id.toString()}
                                        onValueChange={(value) => setData('module_id', value)}
                                        disabled={isView}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select module" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modules.map((module) => {
                                                const dept = departments.find(d => d.id === module.department_id);
                                                return (
                                                    <SelectItem key={module.id} value={module.id.toString()}>
                                                        {module.module_name} ({module.module_code}) - {dept?.dept_name || 'Unknown Dept'}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.module_id} className="mt-1" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Marks Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Marks Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Final Marks */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Final Marks</Label>
                                </div>
                                <div className="space-y-2">
                                    {finalMarks.map((mark, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Marks"
                                                value={mark.marks || ''}
                                                onChange={(e) => {
                                                    const newMarks = [...finalMarks];
                                                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                                                    newMarks[index] = { ...newMarks[index], marks: value };
                                                    setFinalMarks(newMarks);
                                                }}
                                                disabled={isView}
                                                className="w-32"
                                                min="0"
                                                max="100"
                                            />

                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mid Marks */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Mid Marks</Label>
                                </div>
                                <div className="space-y-2">
                                    {midMarks.map((mark, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Marks"
                                                value={mark.marks || ''}
                                                onChange={(e) => {
                                                    const newMarks = [...midMarks];
                                                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                                                    newMarks[index] = { ...newMarks[index], marks: value };
                                                    setMidMarks(newMarks);
                                                }}
                                                disabled={isView}
                                                className="w-32"
                                                min="0"
                                                max="100"
                                            />
                                            {!isView && midMarks.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setMidMarks(midMarks.filter((_, i) => i !== index))}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CA Marks */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>CA Marks</Label>
                                    {!isView && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCaMarks([...caMarks, { name: '', marks: 0 }])}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {caMarks.map((mark, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                placeholder="Mark name"
                                                value={mark.name}
                                                onChange={(e) => {
                                                    const newMarks = [...caMarks];
                                                    newMarks[index] = { ...newMarks[index], name: e.target.value };
                                                    setCaMarks(newMarks);
                                                }}
                                                disabled={isView}
                                                className="flex-1"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Marks"
                                                value={mark.marks || ''}
                                                onChange={(e) => {
                                                    const newMarks = [...caMarks];
                                                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                                                    newMarks[index] = { ...newMarks[index], marks: value };
                                                    setCaMarks(newMarks);
                                                }}
                                                disabled={isView}
                                                className="w-24"
                                                min="0"
                                                max="100"
                                            />
                                            {!isView && caMarks.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCaMarks(caMarks.filter((_, i) => i !== index))}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Other Marks */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Other Marks</Label>
                                    {!isView && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setOtherMarks([...otherMarks, { name: '', marks: 0 }])}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {otherMarks.map((mark, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                placeholder="Mark name"
                                                value={mark.name}
                                                onChange={(e) => {
                                                    const newMarks = [...otherMarks];
                                                    newMarks[index] = { ...newMarks[index], name: e.target.value };
                                                    setOtherMarks(newMarks);
                                                }}
                                                disabled={isView}
                                                className="flex-1"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Marks"
                                                value={mark.marks || ''}
                                                onChange={(e) => {
                                                    const newMarks = [...otherMarks];
                                                    const value = e.target.value === '' ? 0 : Number(e.target.value);
                                                    newMarks[index] = { ...newMarks[index], marks: value };
                                                    setOtherMarks(newMarks);
                                                }}
                                                disabled={isView}
                                                className="w-24"
                                                min="0"
                                                max="100"
                                            />
                                            {!isView && otherMarks.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setOtherMarks(otherMarks.filter((_, i) => i !== index))}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {!isView && (
                        <Button type="submit" className="mt-4 w-fit cursor-pointer" tabIndex={10} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {processing ? (isEdit ? 'Updating... ' : 'Creating...') : isEdit ? 'Update' : 'Create'} Exam Plan
                        </Button>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}
