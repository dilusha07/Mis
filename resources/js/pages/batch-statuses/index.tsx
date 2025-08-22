import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { CirclePlusIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import { CustomTable } from "@/components/custom-table";
import { BatchStatusTableConfig } from "@/config/tables/batch-status-table";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manage Batch Statuses', href: '/batch-statuses' },
];

interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

interface BatchStatus {
    id: number;
    batch: string;
    academic_year: string;
    degree_year: string;
    semester: string;
    status: number;
    created_at: string;
}

interface BatchStatusPagination {
    data: BatchStatus[];
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
    batchStatuses: BatchStatusPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ batchStatuses, filters, totalCount, filteredCount }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(!!flashMessage);

    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    const { data, setData } = useForm({
        search: filters.search || '',
        perPage: filters.perPage || '10',
    });

    // Search handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value);

        const queryString = {
            ...(value && { search: value }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('batch-statuses.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Reset filters
    const handleReset = () => {
        setData('search', '');
        setData('perPage', '10');

        router.get(route('batch-statuses.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Per page change
    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('batch-statuses.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Delete handler
    const handleDelete = (routePath: string) => {
        if (confirm("Are you sure you want to delete this batch status?")) {
            router.delete(routePath, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Status Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Flash Message */}
                {showAlert && flashMessage && (
                    <Alert
                        variant={'default'}
                        className={`${flash?.success ? 'bg-green-800' : flash?.error ? 'bg-red-800' : ''} ml-auto max-w-md text-white`}
                    >
                        <AlertDescription className="text-white">
                            {flash.success ? 'Success!' : 'Error!'} {flashMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Search & Add button */}
                <div className="mb-4 flex w-full items-center justify-between gap-4">
                    <Input
                        type="text"
                        value={data.search}
                        onChange={handleChange}
                        className="h-10 w-1/2"
                        placeholder="Search Batch Status..."
                        name="search"
                    />
                    <Button onClick={handleReset} className="h-10 cursor-pointer bg-red-600 hover:bg-red-500">
                        <Search size={20} />
                    </Button>
                    <div className="ml-auto">
                        <Link
                            className="text-md flex cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                            as="button"
                            href={route('batch-statuses.create')}
                        >
                            <CirclePlusIcon className="me-2" /> Add Batch Status
                        </Link>
                    </div>
                </div>

                {/* Custom Table */}
                <CustomTable
                    columns={BatchStatusTableConfig.columns}
                    actions={BatchStatusTableConfig.actions}
                    data={batchStatuses.data}
                    from={batchStatuses.from - 1}
                    isModal={false}
                    onDelete={handleDelete}
                    onView={(row) => router.get(route('batch-statuses.show', row.id))}
                    onEdit={(row) => router.get(route('batch-statuses.edit', row.id))}
                />

                {/* Pagination */}
                <Pagination
                    products={batchStatuses}
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
