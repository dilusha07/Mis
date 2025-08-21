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

interface Module {
    id: number;
    module_name: string;
    module_code: string;
}

interface Curriculum {
    id: number;
    curriculum_name: string;
}

interface PrerequisiteFormProps {
    prerequisite?: {
        id: number;
        module_id: number;
        pre_module_id: number;
        curriculum_id: number;
        module?: Module;
        prerequisiteModule?: Module;
        curriculum?: Curriculum;
    };
    modules: Module[];
    curriculums: Curriculum[];
    isView?: boolean;
    isEdit?: boolean;
}

export default function PrerequisiteForm({ prerequisite, modules, curriculums, isView, isEdit }: PrerequisiteFormProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Prerequisite`,
            href: route('prerequisites.create'),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        module_id: prerequisite?.module_id || '',
        pre_module_id: prerequisite?.pre_module_id || '',
        curriculum_id: prerequisite?.curriculum_id || '',
        _method: isEdit ? 'PUT' : 'POST',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && prerequisite) {
            post(route('prerequisites.update', prerequisite.id), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('prerequisites.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prerequisite Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                        href={route('prerequisites.index')}
                    >
                        <ArrowLeft className="me-2" /> Back to Prerequisites
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isView ? 'Show' : isEdit ? 'Update' : 'Create'} Prerequisite</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="module_id">Module</Label>
                                    <Select
                                        value={data.module_id.toString()}
                                        onValueChange={(value) => setData('module_id', parseInt(value))}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a module" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modules.map((module) => (
                                                <SelectItem key={module.id} value={module.id.toString()}>
                                                    {module.module_code} - {module.module_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.module_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="pre_module_id">Prerequisite Module</Label>
                                    <Select
                                        value={data.pre_module_id.toString()}
                                        onValueChange={(value) => setData('pre_module_id', parseInt(value))}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a prerequisite module" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modules.map((module) => (
                                                <SelectItem key={module.id} value={module.id.toString()}>
                                                    {module.module_code} - {module.module_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.pre_module_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="curriculum_id">Curriculum</Label>
                                    <Select
                                        value={data.curriculum_id.toString()}
                                        onValueChange={(value) => setData('curriculum_id', parseInt(value))}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a curriculum" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {curriculums.map((curriculum) => (
                                                <SelectItem key={curriculum.id} value={curriculum.id.toString()}>
                                                    {curriculum.curriculum_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.curriculum_id} />
                                </div>

                                {!isView && (
                                    <Button type="submit" className="mt-4 w-fit cursor-pointer" tabIndex={4} disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        {processing ? (isEdit ? 'Updating... ' : 'Creating...') : isEdit ? 'Update' : 'Create'} Prerequisite
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
