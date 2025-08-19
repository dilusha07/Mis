import { CustomTable } from '@/components/custom-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { ModuleTableConfig } from '@/config/tables/module-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlusIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Modules',
        href: '/modules',
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
    module_details: string;
    credits: number;
    created_at: string;
}

interface ModulePagination {
    data: Module[];
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
    modules: ModulePagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ modules, filters, totalCount, filteredCount }: IndexProps) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flash?.success || flash?.error ? true : false);

    // Delete confirmation modal state
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        moduleId: number | null;
        moduleName: string;
        deleteRoute: string;
    }>({
        isOpen: false,
        moduleId: null,
        moduleName: '',
        deleteRoute: '',
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value);

        const queryString = {
            ...(value && { search: value }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        router.get(route('modules.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData('search', '');
        setData('perPage', '10');

        router.get(route('modules.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('modules.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (routeUrl: string) => {
        // Extract module ID and name from the route
        const moduleId = deleteModal.moduleId;
        const moduleName = deleteModal.moduleName;

        if (moduleId && moduleName) {
            router.delete(routeUrl, {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteModal({ isOpen: false, moduleId: null, moduleName: '', deleteRoute: '' });
                }
            });
        }
    };

    const openDeleteModal = (module: Module) => {
        setDeleteModal({
            isOpen: true,
            moduleId: module.id,
            moduleName: module.module_name,
            deleteRoute: route('modules.destroy', module.id),
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, moduleId: null, moduleName: '', deleteRoute: '' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Module Management" />
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
                        placeholder="Search Module..."
                        name="search"
                    />

                    <Button onClick={handleReset} className="h-10 cursor-pointer bg-red-600 hover:bg-red-500">
                        <X size={20} />
                    </Button>

                    <div className="ml-auto">
                        <Link
                            className="text-md flex cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                            as="button"
                            href={route('modules.create')}
                        >
                            <CirclePlusIcon className="me-2" /> Add Module
                        </Link>
                    </div>
                </div>

                <CustomTable
                    columns={ModuleTableConfig.columns}
                    actions={ModuleTableConfig.actions}
                    data={modules.data}
                    from={modules.from}
                    onDelete={(route) => {
                        // Find the module for this route
                        const moduleId = route.split('/').pop();
                        const module = modules.data.find(m => m.id.toString() === moduleId);
                        if (module) {
                            openDeleteModal(module);
                        }
                    }}
                    onView={() => {}}
                    onEdit={() => {}}
                />

                <Pagination
                    products={modules}
                    perPage={data.perPage}
                    onPerPageChange={handlePerPageChange}
                    totalCount={totalCount}
                    filteredCount={filteredCount}
                    search={data.search}
                />

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={() => handleDelete(deleteModal.deleteRoute)}
                    title="Delete Module"
                    message="Are you sure you want to delete this module"
                    itemName={deleteModal.moduleName}
                />
            </div>
        </AppLayout>
    );
}


