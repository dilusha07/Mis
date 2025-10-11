import { CustomTable } from '@/components/custom-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BatchSemModuleTableConfig } from '@/config/tables/batch-sem-module-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Batch Semester Modules',
        href: '/batch-sem-modules',
    },
];

interface Module {
    id: number;
    module_name: string;
    module_code: string;
}

interface Employee {
    id: number;
    name: string;
}

interface BatchStatus {
    id: number;
    name: string;
    batch_name?: string;
    semester?: string;
}

interface BatchSemModule {
    id: number;
    gpa_applicability: string;
    offering_type: string;
    created_at: string;
    module?: Module;
    module_coordinator?: Employee;
    lecture?: Employee;
    batch_status?: BatchStatus;
    prerequisites?: number[] | null;
}

interface BatchSemModulePagination {
    data: BatchSemModule[];
    from: number;
}

interface IndexProps {
    batchSemModules: BatchSemModulePagination;
    batches: Array<{ id: number; batch_name: string }>;
    departments: Array<{ id: number; dept_name: string; dept_code: string }>;
}

// Using BatchSemModuleTableConfig for columns and actions

export default function Index({ batchSemModules, batches, departments }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flash?.success || flash?.error ? true : false);

    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    const { data, setData } = useForm({
        selectedBatch: '',
        selectedDepartment: '',
    });



    const handleReset = () => {
        setData('selectedBatch', '');
        setData('selectedDepartment', '');
        router.get(route('batch-sem-modules.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const handleDelete = (routeUrl: string) => {
        router.delete(routeUrl, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Semester Module Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {showAlert && flashMessage && (
                    <Alert
                        variant={'default'}
                        className={`${flash?.success ? 'bg-green-800' : flash?.error ? 'bg-red-800' : ''} ml-auto max-w-md text-white`}
                    >
                        <AlertDescription className="text-white">
                            {flash.success ? 'Success!' : 'Error!'} {''}
                            {flashMessage}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="mb-4 flex w-full items-center justify-between gap-4">
                    <div className="flex gap-4 w-full">
                        <select
                            value={data.selectedBatch}
                            onChange={(e) => {
                                setData('selectedBatch', e.target.value);
                                const queryString = {
                                    selectedBatch: e.target.value,
                                    ...(data.selectedDepartment && { selectedDepartment: data.selectedDepartment }),
                                };
                                router.get(route('batch-sem-modules.index'), queryString, {
                                    preserveState: true,
                                    preserveScroll: true,
                                });
                            }}
                            className="h-10 rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="">Select Batch</option>
                            {batches.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.batch_name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={data.selectedDepartment}
                            onChange={(e) => {
                                setData('selectedDepartment', e.target.value);
                                const queryString = {
                                    ...(data.selectedBatch && { selectedBatch: data.selectedBatch }),
                                    selectedDepartment: e.target.value,
                                };
                                router.get(route('batch-sem-modules.index'), queryString, {
                                    preserveState: true,
                                    preserveScroll: true,
                                });
                            }}
                            className="h-10 rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="">Select Department</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.dept_name}
                                </option>
                            ))}
                        </select>

                        {/* Search functionality commented for future use
                        <Input
                            type="text"
                            value={data.search}
                            onChange={handleChange}
                            className="h-10 w-1/2"
                            placeholder="Search Batch Semester Module..."
                            name="search"
                        />
                        */}
                    </div>

                    <div className="ml-auto">
                        <Link
                            className="text-md flex cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                            as="button"
                            href={route('batch-sem-modules.create')}
                        >
                            <CirclePlusIcon className="me-2" /> Add Batch Semester Module
                        </Link>
                    </div>
                </div>

                {data.selectedBatch && data.selectedDepartment ? (
                    <>
                        <div className="bg-white p-4 rounded-lg shadow mb-4">
                            <h2 className="text-xl font-semibold mb-2">
                                Batch Semester Module Details
                            </h2>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                    <span className="font-medium">Batch:</span>{' '}
                                    {batches.find(b => b.id.toString() === data.selectedBatch)?.batch_name}
                                </p>
                                <p>
                                    <span className="font-medium">Department:</span>{' '}
                                    {departments.find(d => d.id.toString() === data.selectedDepartment)?.dept_name}
                                </p>
                                <p>
                                    <span className="font-medium">Total Modules:</span>{' '}
                                    {batchSemModules.data.length}
                                </p>
                            </div>
                        </div>
                        <CustomTable
                            columns={BatchSemModuleTableConfig.columns}
                            actions={BatchSemModuleTableConfig.actions}
                            data={batchSemModules.data.map(item => ({
                                ...item,
                                module_name: `${item.module?.module_code || ''} - ${item.module?.module_name || 'Unknown Module'}`,
                                module_code: item.module?.module_code || 'N/A',
                                semester: item.batch_status?.name || 'N/A',
                                module_type: item.offering_type || 'N/A',
                                gpa_applicability: item.gpa_applicability || 'N/A',
                                module_coordinator: item.module_coordinator?.name || 'Not Assigned',
                                lecture: item.lecture?.name || 'Not Assigned'
                            }))}
                            from={batchSemModules.from}
                            onDelete={handleDelete}
                            onView={() => {}}
                            onEdit={() => {}}
                        />
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data to Display</h3>
                            <p className="text-gray-500">Please select both Batch and Department to view the module details.</p>
                        </div>
                    </div>
                )}

                {/*
                <Pagination
                    products={batchSemModules}
                    perPage={data.perPage}
                    onPerPageChange={handlePerPageChange}
                    totalCount={totalCount}
                    filteredCount={filteredCount}
                    search={data.search}
                />
                */}
            </div>
        </AppLayout>
    );
}
