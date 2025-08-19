import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import React from 'react';

export default function ModuleForm({ ...props }) {
    const { module, isView, isEdit } = props as { module?: any; isView?: boolean; isEdit?: boolean };

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

                                {!isView && (
                                    <Button type="submit" className="mt-4 w-fit cursor-pointer" tabIndex={5} disabled={processing}>
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


