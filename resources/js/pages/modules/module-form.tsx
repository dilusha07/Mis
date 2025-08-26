import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import React from 'react';

export default function ModuleForm({ ...props }) {
    const { module, isView, isEdit, curriculums = [], departments = [] } = props as { module?: any; isView?: boolean; isEdit?: boolean; curriculums?: { id: number; curriculum_name: string }[]; departments?: { id: number; dept_name: string }[] };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Module`,
            href: route('modules.create'),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        module_name: module?.module_name || '',
        module_code: module?.module_code || '',
        module_details: module?.module_details || '',
        credits: module?.credits ?? 0,
        semester: module?.semester || '',
        module_type: module?.module_type || '',
        allowed_stream: Array.isArray(module?.allowed_stream) ? module.allowed_stream.join(', ') : module?.allowed_stream || '',
        curriculum_id: module?.curriculum_id ?? '',
        department_id: module?.department_id ?? '',
        _method: isEdit ? 'PUT' : 'POST',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && module) {
            post(route('modules.update', module.id), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('modules.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const semesterOptions = ['Semester 0','Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8','Semester 9'];
    const moduleTypeOptions = ['Core','General Elective','Technical Elective','Common Core'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Module Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                        href={route('modules.index')}
                    >
                        <ArrowLeft className="me-2" /> Back to Modules
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isView ? 'Show' : isEdit ? 'Update' : 'Create'} Module </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="module_name">Module Name</Label>
                                    <Input
                                        value={data.module_name}
                                        onChange={(e) => setData('module_name', e.target.value)}
                                        id="module_name"
                                        name="module_name"
                                        type="text"
                                        placeholder="Module Name"
                                        autoFocus
                                        tabIndex={1}
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.module_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="module_code">Module Code</Label>
                                    <Input
                                        value={data.module_code}
                                        onChange={(e) => setData('module_code', e.target.value)}
                                        id="module_code"
                                        name="module_code"
                                        type="text"
                                        placeholder="e.g. CS101"
                                        tabIndex={2}
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.module_code} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="module_details">Details</Label>
                                    <CustomTextarea
                                        value={data.module_details}
                                        onChange={(e) => setData('module_details', e.target.value)}
                                        id="module_details"
                                        name="module_details"
                                        tabIndex={3}
                                        placeholder="Module Details"
                                        rows={3}
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.module_details} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="credits">Credits</Label>
                                    <Input
                                        value={data.credits}
                                        onChange={(e) => setData('credits', Number(e.target.value))}
                                        id="credits"
                                        name="credits"
                                        type="number"
                                        placeholder="0"
                                        tabIndex={4}
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.credits} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="semester">Semester</Label>
                                    <select
                                        id="semester"
                                        name="semester"
                                        value={data.semester}
                                        onChange={(e) => setData('semester', e.target.value)}
                                        disabled={isView || processing}
                                        className="h-10 rounded-md border px-3"
                                    >
                                        <option value="">Select Semester</option>
                                        {semesterOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.semester as any} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="module_type">Module Type</Label>
                                    <select
                                        id="module_type"
                                        name="module_type"
                                        value={data.module_type}
                                        onChange={(e) => setData('module_type', e.target.value)}
                                        disabled={isView || processing}
                                        className="h-10 rounded-md border px-3"
                                    >
                                        <option value="">Select Type</option>
                                        {moduleTypeOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.module_type as any} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="allowed_stream">Allowed Stream (comma separated)</Label>
                                    <Input
                                        value={data.allowed_stream}
                                        onChange={(e) => setData('allowed_stream', e.target.value)}
                                        id="allowed_stream"
                                        name="allowed_stream"
                                        type="text"
                                        placeholder="e.g. CS, IT, SE"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.allowed_stream as any} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="curriculum_id">Curriculum</Label>
                                    <select
                                        id="curriculum_id"
                                        name="curriculum_id"
                                        value={data.curriculum_id}
                                        onChange={(e) => setData('curriculum_id', Number(e.target.value))}
                                        disabled={isView || processing}
                                        className="h-10 rounded-md border px-3"
                                    >
                                        <option value="">Select Curriculum</option>
                                        {curriculums.map((c) => (
                                            <option key={c.id} value={c.id}>{c.curriculum_name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.curriculum_id as any} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="department_id">Department</Label>
                                    <select
                                        id="department_id"
                                        name="department_id"
                                        value={data.department_id}
                                        onChange={(e) => setData('department_id', Number(e.target.value))}
                                        disabled={isView || processing}
                                        className="h-10 rounded-md border px-3"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((d) => (
                                            <option key={d.id} value={d.id}>{d.dept_name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.department_id as any} />
                                </div>

                                {!isView && (
                                    <Button type="submit" className="mt-4 w-fit cursor-pointer" tabIndex={10} disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        {processing ? (isEdit ? 'Updating... ' : 'Creating...') : isEdit ? 'Update' : 'Create'} Module
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


