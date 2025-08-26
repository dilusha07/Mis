import { CustomConfirmDialog } from "@/components/custom-confirmDialog";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import React, { useState } from "react";

export default function BatchStatusForm({ ...props }) {
    const { batchStatus, batches, academicYears, isView, isEdit } = props;
    const [openDialog, setOpenDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? "Show" : isEdit ? "Update" : "Create"} Batch Status`,
            href: route("batch-statuses.index"),
        },
    ];

      const { data, setData, post, processing, errors, reset } = useForm({
    batch_id: batchStatus?.batch_id ? String(batchStatus.batch_id) : "",
    acc_year_id: batchStatus?.acc_year_id ? String(batchStatus.acc_year_id) : "",
    degree_year: batchStatus?.degree_year || "",
    semester: batchStatus?.semester || "",
    status: batchStatus?.status ?? 1,
    _method: isEdit ? "PUT" : "POST",
  });

  // Form submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEdit) {
      // Open confirmation dialog for update
      setOpenDialog(true);
    } else {
      // Directly submit for create
      post(route("batch-statuses.store"), {
        onSuccess: () => reset(),
      });
    }
  };

  // Handle confirm from dialog
  const handleConfirm = () => {
    setOpenDialog(false);
    post(route("batch-statuses.update", batchStatus.id), {
      forceFormData: true,
      onSuccess: () => reset(),
    });
  };

  // Helper functions
  const getBatchName = (id: string | number) =>
    batches.find((b: any) => b.id == id)?.batch_name || "";
  const getAcademicYearName = (id: string | number) =>
    academicYears.find((y: any) => y.id == id)?.academic_year || "";
  const getStatusName = (status: any) => (status == 1 ? "Active" : "Passing Out");

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Batch Status Management" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="ml-auto">
          <Link
            as="button"
            className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
            href={route("batch-statuses.index")}
          >
            <ArrowLeft className="me-2" /> Back to Batch Statuses
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isView ? "Show" : isEdit ? "Update" : "Create"} Batch Status
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
              <div className="grid gap-6">
                {/* Batch */}
                <div className="grid gap-2">
                  <Label htmlFor="batch_id">Batch</Label>
                  {isView ? (
                    <Input value={getBatchName(data.batch_id)} disabled />
                  ) : (
                    <select
                      id="batch_id"
                      value={data.batch_id}
                      onChange={(e) => setData("batch_id", e.target.value)}
                      className="rounded border px-3 py-2"
                      disabled={processing}
                    >
                      <option value="">Select Batch</option>
                      {batches.map((batch: any) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.batch_name}
                        </option>
                      ))}
                    </select>
                  )}
                  <InputError message={errors.batch_id} />
                </div>

                {/* Academic Year */}
                <div className="grid gap-2">
                  <Label htmlFor="acc_year_id">Academic Year</Label>
                  {isView ? (
                    <Input value={getAcademicYearName(data.acc_year_id)} disabled />
                  ) : (
                    <select
                      id="acc_year_id"
                      value={data.acc_year_id}
                      onChange={(e) => setData("acc_year_id", e.target.value)}
                      className="rounded border px-3 py-2"
                      disabled={processing}
                    >
                      <option value="">Select Academic Year</option>
                      {academicYears.map((year: any) => (
                        <option key={year.id} value={year.id}>
                          {year.academic_year}
                        </option>
                      ))}
                    </select>
                  )}
                  <InputError message={errors.acc_year_id} />
                </div>

                {/* Degree Year */}
                <div className="grid gap-2">
                  <Label htmlFor="degree_year">Degree Year</Label>
                  {isView ? (
                    <Input value={data.degree_year} disabled />
                  ) : (
                    <select
                      id="degree_year"
                      value={data.degree_year}
                      onChange={(e) => setData("degree_year", e.target.value)}
                      className="rounded border px-3 py-2"
                      disabled={processing}
                    >
                      <option value="">Select Degree Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  )}
                  <InputError message={errors.degree_year} />
                </div>

                {/* Semester */}
                <div className="grid gap-2">
                  <Label htmlFor="semester">Semester</Label>
                  {isView ? (
                    <Input value={data.semester} disabled />
                  ) : (
                    <select
                      id="semester"
                      value={data.semester}
                      onChange={(e) => setData("semester", e.target.value)}
                      className="rounded border px-3 py-2"
                      disabled={processing}
                    >
                      <option value="">Select Semester</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={`Semester ${i}`}>
                          Semester {i}
                        </option>
                      ))}
                    </select>
                  )}
                  <InputError message={errors.semester} />
                </div>

                {/* Status */}
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  {isView ? (
                    <Input value={getStatusName(data.status)} disabled />
                  ) : (
                    <select
                      id="status"
                      value={data.status}
                      onChange={(e) => setData("status", parseInt(e.target.value))}
                      className="rounded border px-3 py-2"
                      disabled={processing || isView}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Passing Out</option>
                    </select>
                  )}
                  <InputError message={errors.status} />
                </div>

                {!isView && (
                  <Button type="submit" className="mt-4 w-fit cursor-pointer" disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {isEdit ? "Update Batch Status" : "Create Batch Status"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* ConfirmDialog only for Update */}
      {isEdit && (
        <CustomConfirmDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          title="Confirm Update"
          description="Are you sure you want to update this batch status?"
          onConfirm={handleConfirm}
        />
      )}
    </AppLayout>
  );
}