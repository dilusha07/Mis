import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import React from 'react';

interface Student {
    id: string;
    name: string;
    student_id: string;
}

interface Advisor {
    id: number;
    name: string;
}

export default function AcademicAdvisorForm({ academicAdvisor, students, advisors, isView, isEdit }: {
    academicAdvisor?: any;
    students: Student[];
    advisors: Advisor[];
    isView?: boolean;
    isEdit?: boolean;
}) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Academic Advisor Assignment`,
            href: route('academic-advisors.create'),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<{
        student_id: string;
        advisor_id: string;
        _method: string;
    }>({
        student_id: academicAdvisor?.student_id || '',
        advisor_id: academicAdvisor?.advisor_id || '',
        _method: isEdit ? 'PUT' : 'POST',
    });

    // Helper functions to get selected names
    const getSelectedStudentName = () => {
        const student = students.find(s => s.id.toString() === data.student_id.toString());
        return student ? `${student.name} (${student.student_id})` : 'Select a student';
    };

    const getSelectedAdvisorName = () => {
        const advisor = advisors.find(a => a.id.toString() === data.advisor_id.toString());
        return advisor ? advisor.name : 'Select an academic advisor';
    };

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && academicAdvisor) {
            post(route('academic-advisors.update', academicAdvisor.id), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('academic-advisors.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Academic Advisor Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                        href={route('academic-advisors.index')}
                    >
                        <ArrowLeft className="me-2" /> Back to Academic Advisors
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isView ? 'Show' : isEdit ? 'Update' : 'Create'} Academic Advisor Assignment</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="student_id">Student</Label>
                                    <Select
                                        value={data.student_id}
                                        onValueChange={(value) => setData('student_id', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger className={errors.student_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select a student">
                                                {getSelectedStudentName()}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {students.map((student) => (
                                                <SelectItem key={student.id} value={student.id}>
                                                    {student.name} ({student.student_id})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                                                         {errors.student_id && (
                                         <div className="text-sm text-red-600 mt-1">
                                             {errors.student_id}
                                         </div>
                                     )}
                                     

                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="advisor_id">Academic Advisor</Label>
                                    <Select
                                        value={data.advisor_id}
                                        onValueChange={(value) => setData('advisor_id', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger className={errors.advisor_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select an academic advisor">
                                                {getSelectedAdvisorName()}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {advisors.map((advisor) => (
                                                <SelectItem key={advisor.id} value={advisor.id.toString()}>
                                                    {advisor.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                                                         {errors.advisor_id && (
                                         <div className="text-sm text-red-600 mt-1">
                                             {errors.advisor_id}
                                         </div>
                                     )}
                                     

                                </div>

                                {!isView && (
                                    <Button type="submit" className="mt-4 w-fit cursor-pointer" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        {processing ? (isEdit ? 'Updating... ' : 'Creating...') : isEdit ? 'Update' : 'Create'} Advisor
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
