import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, LoaderCircle } from "lucide-react";

import React from "react";

export default function CurriculumForm({...props}) {
    const { curriculum, isView, isEdit } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Curriculum`,
            href: route('curriculums.create'),
        },
    ];
    
const { data, setData, post, processing, errors, reset } = useForm({
        curriculum_code: curriculum?.curriculum_code || '',
        curriculum_name: curriculum?.curriculum_name || '',
        start_date: curriculum?.start_date || '',
        start_batch_from: curriculum?.start_batch_from || '',
        end_batch_to: curriculum?.end_batch_to || '',
        _method: isEdit ? 'PUT' : 'POST',
    });

// Form Submit Handler
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            post(route('curriculums.update', curriculum.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('curriculums.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Curriculum Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                        href={route('curriculums.index')}
                    >
                        <ArrowLeft className="me-2" /> Back to Curriculums
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isView ? 'Show' : isEdit ? 'Update' : 'Create'} Curriculum</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                {/* Curriculum Code */}
                                <div className="grid gap-2">
                                    <Label htmlFor="curriculum_code">Curriculum Code</Label>
                                    <Input
                                        value={data.curriculum_code}
                                        onChange={(e) => setData('curriculum_code', e.target.value)}
                                        id="curriculum_code"
                                        type="text"
                                        placeholder="Enter curriculum code (e.g., CU-18)"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.curriculum_code} />
                                </div>

                                {/* Curriculum Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="curriculum_name">Curriculum Name</Label>
                                    <Input
                                        value={data.curriculum_name}
                                        onChange={(e) => setData('curriculum_name', e.target.value)}
                                        id="curriculum_name"
                                        type="text"
                                        placeholder="Enter curriculum name (e.g., Curriculum-2018)"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.curriculum_name} />
                                </div>

                                {/* Start Date */}
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        id="start_date"
                                        type="date"
                                        placeholder="Select start date"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                {/* Start Batch */}
                                <div className="grid gap-2">
                                    <Label htmlFor="start_batch_from">Start Batch From</Label>
                                    <Input
                                        value={data.start_batch_from}
                                        onChange={(e) => setData('start_batch_from', e.target.value)}
                                        id="start_batch_from"
                                        type="number"
                                        placeholder="Enter starting batch number"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.start_batch_from} />
                                </div>

                                {/* End Batch */}
                                <div className="grid gap-2">
                                    <Label htmlFor="end_batch_to">End Batch To</Label>
                                    <Input
                                        value={data.end_batch_to}
                                        onChange={(e) => setData('end_batch_to', e.target.value)}
                                        id="end_batch_to"
                                        type="number"
                                        placeholder="Enter ending batch number"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.end_batch_to} />
                                </div>

                                {/* Submit */}
                                {!isView && (
                                    <Button type="submit" className="mt-4 w-fit cursor-pointer">
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        {processing ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update' : 'Create'} Curriculum
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
