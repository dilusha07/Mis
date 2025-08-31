import { CustomTable } from '@/components/custom-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { ExamPlanTableConfig } from '@/config/tables/exam-plan-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CirclePlusIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Exam Plans',
        href: '/exam-plans',
    },
];

interface LinkProps {
    active: boolean;
    label: string;
    url: string;
}

interface ExamPlan {
    id: number;
    first_examiner: string;
    second_examiner: string;
    department: string;
    module: string;
    module_code: string;
    final_marks: any;
    mid_marks: any;
    ca_marks: any;
    other_marks: any;
    created_at: string;
}

interface ExamPlanPagination {
    data: ExamPlan[];
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
    examPlans: ExamPlanPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ examPlans, filters, totalCount, filteredCount }: IndexProps) {
    const { flash } = usePage<PageProps>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flash?.success || flash?.error ? true : false);

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

        router.get(route('exam-plans.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData('search', '');
        setData('perPage', '10');

        router.get(route('exam-plans.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('exam-plans.index'), queryString, {
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
            <Head title="Exam Plan Management" />
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
                        placeholder="Search Exam Plan..."
                        name="search"
                    />

                    <Button onClick={handleReset} className="h-10 cursor-pointer bg-red-600 hover:bg-red-500">
                        <X size={20} />
                    </Button>

                    <div className="ml-auto flex gap-2">
                        <Link
                            className="text-md flex cursor-pointer items-center rounded-lg bg-green-600 px-4 py-2 text-white hover:opacity-90"
                            as="button"
                            href={route('exam-plans.create')}
                        >
                            Enter Marks
                        </Link>
                        <Link
                            className="text-md flex cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                            as="button"
                            href={route('exam-plans.create')}
                        >
                            <CirclePlusIcon className="me-2" /> Add Exam Plan
                        </Link>
                    </div>
                </div>

                <CustomTable
                    columns={ExamPlanTableConfig.columns}
                    actions={ExamPlanTableConfig.actions}
                    data={examPlans.data}
                    from={examPlans.from}
                    onDelete={handleDelete}
                    onView={() => {}}
                    onEdit={() => {}}
                />

                {/* Temporarily commented out pagination
                <Pagination
                    products={examPlans}
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
