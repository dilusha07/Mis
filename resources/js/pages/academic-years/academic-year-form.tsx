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

export default function AcademicYearForm({ ...props }) {
    const { academicYear, curriculums, isView, isEdit } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? "Show" : isEdit ? "Update" : "Create"} Academic Year`,
            href: route("academic-years.create"),
        },
    ];

    // Form state
    const { data, setData, post, processing, errors, reset } = useForm({
        academic_year: academicYear?.academic_year || "",
        year_begin: academicYear?.year_begin || "",
        year_end: academicYear?.year_end || "",
        status: academicYear?.status ?? 1,
        curriculum_id: academicYear?.curriculum_id || "",
        _method: isEdit ? "PUT" : "POST",
    });

    // Submit handler
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            post(route("academic-years.update", academicYear.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route("academic-years.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Academic Year Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                        href={route("academic-years.index")}
                    >
                        <ArrowLeft className="me-2" /> Back to Academic Years
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isView ? "Show" : isEdit ? "Update" : "Create"} Academic Year
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                {/* Academic Year */}
                                <div className="grid gap-2">
                                    <Label htmlFor="academic_year">Academic Year</Label>
                                    <Input
                                        value={data.academic_year}
                                        onChange={(e) => setData("academic_year", e.target.value)}
                                        id="academic_year"
                                        type="text"
                                        placeholder="e.g., 2023-2024"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.academic_year} />
                                </div>

                                {/* Year Begin */}
                                <div className="grid gap-2">
                                    <Label htmlFor="year_begin">Year Begin</Label>
                                    <Input
                                        value={data.year_begin}
                                        onChange={(e) => setData("year_begin", e.target.value)}
                                        id="year_begin"
                                        type="date"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.year_begin} />
                                </div>

                                {/* Year End */}
                                <div className="grid gap-2">
                                    <Label htmlFor="year_end">Year End</Label>
                                    <Input
                                        value={data.year_end}
                                        onChange={(e) => setData("year_end", e.target.value)}
                                        id="year_end"
                                        type="date"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.year_end} />
                                </div>

                                {/* Status */}
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData("status", Number(e.target.value))}
                                        disabled={isView || processing}
                                        className="rounded-md border p-2"
                                    >
                                        <option value={1}>Active</option>
                                        <option value={0}>Inactive</option>
                                        <option value={2}>Old</option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>

                                {/* Curriculum (Foreign Key) */}
                                <div className="grid gap-2">
                                    <Label htmlFor="curriculum_id">Curriculum</Label>
                                    <select
                                        id="curriculum_id"
                                        value={data.curriculum_id}
                                        onChange={(e) => setData("curriculum_id", e.target.value)}
                                        disabled={isView || processing}
                                        className="rounded-md border p-2"
                                    >
                                        <option value="">-- Select Curriculum --</option>
                                        {curriculums?.map((c: any) => (
                                            <option key={c.id} value={c.id}>
                                                {c.curriculum_name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.curriculum_id} />
                                </div>

                                {/* Submit */}
                                {!isView && (
                                    <Button type="submit" className="mt-4 w-fit cursor-pointer">
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        {processing
                                            ? isEdit
                                                ? "Updating..."
                                                : "Creating..."
                                            : isEdit
                                            ? "Update"
                                            : "Create"}{" "}
                                        Academic Year
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
