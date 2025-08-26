import { CustomTable } from '@/components/custom-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { BatchSemModuleTableConfig } from '@/config/tables/batch-sem-module-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlusIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Batch Semester Modules',
        href: '/batch-sem-modules',
    },
];

interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

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
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface FilterProps {
    search: string;
    perPage: string;
}

interface IndexProps {
    batchSemModules: BatchSemModulePagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

// Using BatchSemModuleTableConfig for columns and actions

export default function Index({ batchSemModules, filters, totalCount, filteredCount }: IndexProps) {
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
        search: filters?.search || '',
        perPage: filters?.perPage || '10',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value);

        const queryString = {
            ...(value && { search: value }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('batch-sem-modules.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData('search', '');
        setData('perPage', '10');

        router.get(route('batch-sem-modules.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('batch-sem-modules.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
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
                    <Input
                        type="text"
                        value={data.search}
                        onChange={handleChange}
                        className="h-10 w-1/2"
                        placeholder="Search Batch Semester Module..."
                        name="search"
                    />

                    <Button onClick={handleReset} className="h-10 cursor-pointer bg-red-600 hover:bg-red-500">
                        <X size={20} />
                    </Button>

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

                <Pagination
                    products={batchSemModules}
                    perPage={data.perPage}
                    onPerPageChange={handlePerPageChange}
                    totalCount={totalCount}
                    filteredCount={filteredCount}
                    search={data.search}
                />
            </div>
        </AppLayout>
    );
}
