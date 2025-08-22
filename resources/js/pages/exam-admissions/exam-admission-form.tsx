import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import React from 'react';

export default function ExamAdmissionForm({ ...props }) {
    const { 
        examAdmission, 
        batchSemModules, 
        isView, 
        isEdit 
    } = props as { 
        examAdmission?: any; 
        batchSemModules?: any[]; 
        isView?: boolean; 
        isEdit?: boolean; 
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Exam Admission`,
            href: route('exam-admissions.create'),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        batch_sem_module_id: examAdmission?.batch_sem_module_id || '',
        exam_date: examAdmission?.exam_date || '',
        start_time: examAdmission?.start_time || '',
        end_time: examAdmission?.end_time || '',
        venue: examAdmission?.venue || '',
        student_group: examAdmission?.student_group || '',
        _method: isEdit ? 'PUT' : 'POST',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && examAdmission) {
            post(route('exam-admissions.update', examAdmission.id), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('exam-admissions.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exam Admission Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                        href={route('exam-admissions.index')}
                    >
                        <ArrowLeft className="me-2" /> Back to Exam Admissions
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isView ? 'Show' : isEdit ? 'Update' : 'Create'} Exam Admission</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="batch_sem_module_id">Batch Semester Module *</Label>
                                    <Select
                                        value={data.batch_sem_module_id}
                                        onValueChange={(value) => setData('batch_sem_module_id', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a batch semester module" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {batchSemModules && batchSemModules.length > 0 ? (
                                                batchSemModules.map((bsm) => (
                                                    <SelectItem key={bsm.id} value={bsm.id.toString()}>
                                                        {bsm.module?.module_code} - {bsm.module?.module_name} ({bsm.semester})
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-bsm" disabled>No batch semester modules available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.batch_sem_module_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="exam_date">Exam Date *</Label>
                                    <Input
                                        value={data.exam_date}
                                        onChange={(e) => setData('exam_date', e.target.value)}
                                        id="exam_date"
                                        name="exam_date"
                                        type="date"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.exam_date} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="start_time">Start Time *</Label>
                                    <Input
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        id="start_time"
                                        name="start_time"
                                        type="time"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.start_time} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="end_time">End Time *</Label>
                                    <Input
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        id="end_time"
                                        name="end_time"
                                        type="time"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.end_time} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="venue">Venue *</Label>
                                    <Input
                                        value={data.venue}
                                        onChange={(e) => setData('venue', e.target.value)}
                                        id="venue"
                                        name="venue"
                                        type="text"
                                        placeholder="e.g., Room 101, Building A"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.venue} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="student_group">Student Group *</Label>
                                    <Input
                                        value={data.student_group}
                                        onChange={(e) => setData('student_group', e.target.value)}
                                        id="student_group"
                                        name="student_group"
                                        type="text"
                                        placeholder="e.g., Group A, Computer Science"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.student_group} />
                                </div>
                            </div>

                            {!isView && (
                                <Button type="submit" className="mt-4 w-fit cursor-pointer" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {processing ? (isEdit ? 'Updating... ' : 'Creating...') : isEdit ? 'Update' : 'Create'} Exam Admission
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
