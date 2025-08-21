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

export default function BatchSemModuleForm(props: any) {
    const { 
        batchSemModule, 
        modules, 
        modulePrerequisites, 
        employees, 
        batchStatuses, 
        isView, 
        isEdit 
    } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Batch Semester Module`,
            href: route('batch-sem-modules.create'),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        module_id: batchSemModule?.module_id || '',
        module_prerequisites_id: batchSemModule?.module_prerequisites_id || '',
        module_coordinator_id: batchSemModule?.module_coordinator_id || '',
        lecture_id: batchSemModule?.lecture_id || '',
        batch_status_id: batchSemModule?.batch_status_id || '',
        semester: batchSemModule?.semester || '',
        module_type: batchSemModule?.module_type || '',
        gpa_applicability: batchSemModule?.gpa_applicability || '',
        allowed_for: batchSemModule?.allowed_for || '',
        _method: isEdit ? 'PUT' : 'POST',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && batchSemModule) {
            post(route('batch-sem-modules.update', batchSemModule.id), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('batch-sem-modules.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Semester Module Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                        href={route('batch-sem-modules.index')}
                    >
                        <ArrowLeft className="me-2" /> Back to Batch Semester Modules
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isView ? 'Show' : isEdit ? 'Update' : 'Create'} Batch Semester Module</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="module_id">Module *</Label>
                                    <Select
                                        value={data.module_id}
                                        onValueChange={(value) => setData('module_id', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a module" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modules && modules.length > 0 ? (
                                                modules.map((module) => (
                                                    <SelectItem key={module.id} value={module.id.toString()}>
                                                        {module.module_code} - {module.module_name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-modules" disabled>No modules available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.module_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="module_prerequisites_id">Module Prerequisites</Label>
                                    <Select
                                        value={data.module_prerequisites_id}
                                        onValueChange={(value) => setData('module_prerequisites_id', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select prerequisites (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="no-prerequisites">No Prerequisites</SelectItem>
                                            {modulePrerequisites && modulePrerequisites.length > 0 ? (
                                                modulePrerequisites.map((prereq) => (
                                                    <SelectItem key={prereq.id} value={prereq.id.toString()}>
                                                        {prereq.module.module_code} - {prereq.module.module_name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-prereq-available" disabled>No prerequisites available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.module_prerequisites_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="allowed_for">Allowed For *</Label>
                                    <Input
                                        value={data.allowed_for}
                                        onChange={(e) => setData('allowed_for', e.target.value)}
                                        id="allowed_for"
                                        name="allowed_for"
                                        type="text"
                                        placeholder="e.g., Computer Science, Software Engineering"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.allowed_for} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="module_coordinator_id">Module Coordinator *</Label>
                                    <Select
                                        value={data.module_coordinator_id}
                                        onValueChange={(value) => setData('module_coordinator_id', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select module coordinator" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees && employees.length > 0 ? (
                                                employees.map((employee) => (
                                                    <SelectItem key={employee.id} value={employee.id.toString()}>
                                                        {employee.full_name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-employees" disabled>No employees available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.module_coordinator_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="semester">Semester *</Label>
                                    <Select
                                        value={data.semester}
                                        onValueChange={(value) => setData('semester', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Semester 0">Semester 0</SelectItem>
                                            <SelectItem value="Semester 1">Semester 1</SelectItem>
                                            <SelectItem value="Semester 2">Semester 2</SelectItem>
                                            <SelectItem value="Semester 3">Semester 3</SelectItem>
                                            <SelectItem value="Semester 4">Semester 4</SelectItem>
                                            <SelectItem value="Semester 5">Semester 5</SelectItem>
                                            <SelectItem value="Semester 6">Semester 6</SelectItem>
                                            <SelectItem value="Semester 7">Semester 7</SelectItem>
                                            <SelectItem value="Semester 8">Semester 8</SelectItem>
                                            <SelectItem value="Semester 9">Semester 9</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.semester} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="lecture_id">Lecture *</Label>
                                    <Select
                                        value={data.lecture_id}
                                        onValueChange={(value) => setData('lecture_id', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select lecture" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employees && employees.length > 0 ? (
                                                employees.map((employee) => (
                                                    <SelectItem key={employee.id} value={employee.id.toString()}>
                                                        {employee.full_name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-lectures" disabled>No employees available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.lecture_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="module_type">Module Type *</Label>
                                    <Select
                                        value={data.module_type}
                                        onValueChange={(value) => setData('module_type', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select module type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Core">Core</SelectItem>
                                            <SelectItem value="General Elective">General Elective</SelectItem>
                                            <SelectItem value="Technical Elective">Technical Elective</SelectItem>
                                            <SelectItem value="Common Core">Common Core</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.module_type} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="batch_status_id">Batch Status *</Label>
                                    <Select
                                        value={data.batch_status_id}
                                        onValueChange={(value) => setData('batch_status_id', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select batch status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {batchStatuses && batchStatuses.length > 0 ? (
                                                batchStatuses.map((status) => (
                                                    <SelectItem key={status.id} value={status.id.toString()}>
                                                        {status.status === 1 ? 'Active' : 'Finished'}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-statuses" disabled>No batch statuses available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.batch_status_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="gpa_applicability">GPA Applicability *</Label>
                                    <Select
                                        value={data.gpa_applicability}
                                        onValueChange={(value) => setData('gpa_applicability', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select GPA applicability" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GPA">GPA</SelectItem>
                                            <SelectItem value="NON_GPA">NON_GPA</SelectItem>
                                            <SelectItem value="GPA or NON_GPA">GPA or NON_GPA</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.gpa_applicability} />
                                </div>
                            </div>

                            {!isView && (
                                <Button type="submit" className="mt-4 w-fit cursor-pointer" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {processing ? (isEdit ? 'Updating... ' : 'Creating...') : isEdit ? 'Update' : 'Create'} Batch Semester Module
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
