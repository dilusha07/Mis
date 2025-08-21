import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import React from "react";

interface BatchFormProps {
    batch?: {
        id: number;
        batch_name: string;
        curriculum_id: number;
        start_date: string;
        effective_date?: string | null;
    };
    curriculums: { id: number; curriculum_name: string }[];
    isView?: boolean;
    isEdit?: boolean;
}

export default function BatchForm({ batch, curriculums, isView = false, isEdit = false }: BatchFormProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? "Show" : isEdit ? "Update" : "Create"} Batch`,
            href: route("batches.create"),
        },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        batch_name: batch?.batch_name || "",
        curriculum_id: batch?.curriculum_id?.toString() || "",
        start_date: batch?.start_date || "",
        effective_date: batch?.effective_date || "",
        _method: isEdit ? "PUT" : "POST",
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit && batch) {
            post(route("batches.update", batch.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route("batches.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                        href={route("batches.index")}
                    >
                        <ArrowLeft className="me-2" /> Back to Batches
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isView ? "Show" : isEdit ? "Update" : "Create"} Batch</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                {/* Batch Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="batch_name">Batch Name</Label>
                                    <Input
                                        value={data.batch_name}
                                        onChange={(e) => setData("batch_name", e.target.value)}
                                        id="batch_name"
                                        type="text"
                                        placeholder="Enter batch name"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.batch_name} />
                                </div>

                                {/* Curriculum Dropdown */}
                                <div className="grid gap-2">
                                    <Label htmlFor="curriculum_id">Curriculum</Label>
                                    <Select
                                        value={data.curriculum_id}
                                        onValueChange={(value) => setData("curriculum_id", value)}
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

                                {/* Start Date */}
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        value={data.start_date}
                                        onChange={(e) => setData("start_date", e.target.value)}
                                        id="start_date"
                                        type="date"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                {/* Effective Date */}
                                <div className="grid gap-2">
                                    <Label htmlFor="effective_date">Effective Date</Label>
                                    <Input
                                        value={data.effective_date}
                                        onChange={(e) => setData("effective_date", e.target.value)}
                                        id="effective_date"
                                        type="date"
                                        disabled={isView || processing}
                                    />
                                    <InputError message={errors.effective_date} />
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
                                        Batch
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
