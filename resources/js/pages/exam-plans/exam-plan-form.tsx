import InputError from '@/components/input-error';
import MarkSection from '@/components/mark-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Lecturer {
    id: number;
    full_name: string;
    department_id: number;
}

interface Department {
    id: number;
    dept_name: string;
}

interface Module {
    id: number;
    module_name: string;
    module_code: string;
    department_id: number;
}

interface MarkItem {
    name: string;
    marks: number;
}

interface ExamPlan {
    id: number;
    first_examiner_id: number;
    second_examiner_id: number;
    department_id: number;
    module_id: number;
    final_marks: string | MarkItem[];
    mid_marks: string | MarkItem[];
    ca_marks: string | MarkItem[];
    other_marks: string | MarkItem[];
}

interface ExamPlanFormProps {
    examPlan?: ExamPlan;
    isView?: boolean;
    isEdit?: boolean;
    lecturers: Lecturer[];
    departments: Department[];
    modules: Module[];
}

export default function ExamPlanForm({ examPlan, isView, isEdit, lecturers, departments, modules }: ExamPlanFormProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Exam Plan`,
            href: route('exam-plans.create'),
        },
    ];

    const parseMarks = (marks: string | MarkItem[] | undefined): MarkItem[] => {
        if (!marks) return [{ name: '', marks: 0 }];
        return typeof marks === 'string' ? JSON.parse(marks) : marks;
    };

    const [finalMarks, setFinalMarks] = useState<MarkItem[]>(parseMarks(examPlan?.final_marks));
    const [midMarks, setMidMarks] = useState<MarkItem[]>(parseMarks(examPlan?.mid_marks));
    const [caMarks, setCaMarks] = useState<MarkItem[]>(parseMarks(examPlan?.ca_marks));
    const [otherMarks, setOtherMarks] = useState<MarkItem[]>(parseMarks(examPlan?.other_marks));

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
                            <MarkSection
                                title="Final Marks"
                                marks={finalMarks}
                                setMarks={setFinalMarks}
                                isView={isView}
                            />

                            {/* Mid Marks */}
                            <MarkSection
                                title="Mid Marks"
                                marks={midMarks}
                                setMarks={setMidMarks}
                                isView={isView}
                            />

                            {/* CA Marks */}
                            <MarkSection
                                title="CA Marks"
                                marks={caMarks}
                                setMarks={setCaMarks}
                                isView={isView}
                                showName
                            />

                            {/* Other Marks */}
                            <MarkSection
                                title="Other Marks"
                                marks={otherMarks}
                                setMarks={setOtherMarks}
                                isView={isView}
                                showName
                            />
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
