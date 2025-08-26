import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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

interface Employee {
    id: number;
    name?: string;
    full_name?: string;
}

interface BatchStatus {
    id: number;
    status_name: string;
    batch_id: number;
    semester: string;
    status?: string;
}

interface BatchSemModule {
    id: number;
    module_id: number;
    prerequisites: string | number[] | any; // Allow different formats for proper type handling
    module_coordinator_id: number;
    lecture_id: number;
    batch_id?: number;
    batch_status_id: number;
    semester?: string;
    module_type?: string;
    allowed_for?: string;
    gpa_applicability: string;
    offering_type: string;
}

interface Batch {
    id: number;
    batch_name: string;
}

interface BatchSemModuleFormProps {
    batchSemModule?: BatchSemModule;
    modules: Module[];
    lecturers?: Employee[];
    employees?: Employee[];
    batchStatuses?: BatchStatus[];
    batchStatusesAll?: BatchStatus[];
    batches?: Batch[];
    modulePrerequisites?: any[];
    isView?: boolean;
    isEdit?: boolean;
}

export default function BatchSemModuleForm({ batchSemModule, modules, employees, lecturers, batchStatuses, batchStatusesAll, batches, modulePrerequisites, isView, isEdit }: BatchSemModuleFormProps) {
    // Use employees or lecturers, whichever is provided
    const employeeList = employees || lecturers || [];
    // Use batchStatuses or extract unique status names from batchStatusesAll
    const batchStatusList = batchStatuses || (batchStatusesAll ?
        batchStatusesAll.map(status => ({
            id: status.id,
            status_name: `${status.semester} - ${status.status}`
        })) : []);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${isView ? 'Show' : isEdit ? 'Update' : 'Create'} Batch Semester Module`,
            href: route('batch-sem-modules.create'),
        },
    ];

    // Parse prerequisites JSON if it's a string
    const parsedPrerequisites = React.useMemo(() => {
        try {
            if (!batchSemModule?.prerequisites) return [];

            // Check if already an array of numbers
            if (Array.isArray(batchSemModule.prerequisites)) {
                return batchSemModule.prerequisites.map(Number);
            }

            // If string, try to parse it as JSON
            if (typeof batchSemModule.prerequisites === 'string') {
                const parsed = JSON.parse(batchSemModule.prerequisites);
                if (Array.isArray(parsed)) {
                    return parsed.map(Number);
                } else {
                    // If it's some other format, return empty array
                    return [];
                }
            }
            return [];
        } catch (e) {
            // Error parsing prerequisites, return empty array
            return [];
        }
    }, [batchSemModule?.prerequisites]);

    // State for filtered batch statuses
    const [filteredBatchStatuses, setFilteredBatchStatuses] = React.useState<BatchStatus[]>([]);
    const [selectedSemester, setSelectedSemester] = React.useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm<{
        module_id: string | number;
        prerequisites: number[];
        module_coordinator_id: string | number;
        lecture_id: string | number;
        batch_id: string | number; // Keep for UI interaction but don't send to backend
        batch_status_id: string | number;
        semester: string;
        module_type: string;
        gpa_applicability: string;
        allowed_for: string;
        offering_type: string;
        _method: string;
    }>({
        module_id: batchSemModule?.module_id || '',
        prerequisites: parsedPrerequisites,
        module_coordinator_id: batchSemModule?.module_coordinator_id || '',
        lecture_id: batchSemModule?.lecture_id || '',
        batch_id: batchSemModule?.batch_id || '',
        batch_status_id: batchSemModule?.batch_status_id || '',
        semester: batchSemModule?.semester || '',
        module_type: batchSemModule?.module_type || 'Core', // Default to 'Core'
        gpa_applicability: batchSemModule?.gpa_applicability || '',
        allowed_for: batchSemModule?.allowed_for || 'All Students', // Default value
        offering_type: batchSemModule?.offering_type || 'PROPER',
        _method: isEdit ? 'PUT' : 'POST',
    });

    // Handle batch selection
    React.useEffect(() => {
        if (data.batch_id && batchStatusesAll) {
            const filteredStatuses = batchStatusesAll.filter(
                status => status.batch_id === Number(data.batch_id)
            );

            // Get unique semesters from filtered batch statuses
            if (filteredStatuses.length > 0) {
                const firstStatus = filteredStatuses[0];

                // Get the first semester from filtered statuses
                setSelectedSemester(firstStatus.semester);

                // Update form data with semester and batch_status_id
                setData('semester', firstStatus.semester);
                setData('batch_status_id', firstStatus.id);

                // Set default values for other required fields if they're not already set
                if (!data.module_type) {
                    setData('module_type', 'Core');
                }

                if (!data.allowed_for) {
                    setData('allowed_for', 'All Students');
                }

                // Keep filtered statuses for reference
                setFilteredBatchStatuses([firstStatus]);
            } else {
                setSelectedSemester('');
                setFilteredBatchStatuses([]);
            }
        } else {
            setFilteredBatchStatuses([]);
            setSelectedSemester('');
        }
    }, [data.batch_id, batchStatusesAll]);

    // Handle form submission
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Transform prerequisites to array
        const formData = {
            ...data,
            prerequisites: Array.isArray(data.prerequisites)
                ? data.prerequisites
                : (typeof data.prerequisites === 'string' && data.prerequisites !== '')
                    ? JSON.parse(data.prerequisites as string)
                    : []
        };

        if (isEdit && batchSemModule?.id) {
            // Update mode
            post(route('batch-sem-modules.update', batchSemModule.id), formData as any);
        } else {
            // Create mode
            post(route('batch-sem-modules.store'), formData as any);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Semester Module Management" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as="button"
                        className="text-md flex w-fit cursor-pointer items-center rounded-lg bg-indigo-800 px-4 py-2 text-white hover:opacity-90"
                        href={route('batch-sem-modules.index')}
                    >
                        <ArrowLeft className="me-2" /> Back to Batch Semester Modules
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{isView ? 'Show' : isEdit ? 'Update' : 'Create'} Batch Semester Module</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" autoComplete="off">
                            <div className="grid gap-6">
                                {/* Module Selection */}
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

                                {/* Prerequisites */}
                                <div className="grid gap-2">
                                    <Label>Prerequisite Modules</Label>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {modules
                                            .filter((m) => m.id !== Number(data.module_id))
                                            .map((module) => {
                                                const checked = Array.isArray(data.prerequisites) &&
                                                    data.prerequisites.includes(module.id);
                                                return (
                                                    <label key={module.id} className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={checked}
                                                            disabled={isView || processing}
                                                            onCheckedChange={(val) => {
                                                                const isChecked = Boolean(val);
                                                                // Ensure we have a proper array of numbers
                                                                let current = Array.isArray(data.prerequisites) ?
                                                                    [...data.prerequisites].map(Number) : [];

                                                                if (isChecked) {
                                                                    // Convert module.id to a number and add if not already in the array
                                                                    const moduleId = Number(module.id);
                                                                    if (!current.includes(moduleId)) current.push(moduleId);
                                                                } else {
                                                                    // Remove this module ID
                                                                    current = current.filter((id) => id !== Number(module.id));
                                                                }

                                                                setData('prerequisites', current);
                                                                // Prerequisites updated
                                                            }}
                                                        />
                                                        <span>{module.module_code} - {module.module_name}</span>
                                                    </label>
                                                );
                                            })}
                                    </div>
                                    <InputError message={errors.prerequisites} />
                                </div>

                                {/* Batch Selection */}
                                <div className="grid gap-2">
                                    <Label htmlFor="batch_id">Batch</Label>
                                    <Select
                                        value={data.batch_id.toString()}
                                        onValueChange={(value) => setData('batch_id', parseInt(value))}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a batch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {batches?.map((batch) => (
                                                <SelectItem key={batch.id} value={batch.id.toString()}>
                                                    {batch.batch_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.batch_id} />
                                </div>

                                {/* Display Selected Semester */}
                                {data.batch_id && selectedSemester && (
                                    <div className="rounded bg-indigo-50 p-2 text-indigo-800">
                                        <p><strong>Semester:</strong> {selectedSemester}</p>
                                    </div>
                                )}

                                {/* Module Coordinator */}
                                <div className="grid gap-2">
                                    <Label htmlFor="module_coordinator_id">Module Coordinator</Label>
                                    <Select
                                        value={data.module_coordinator_id.toString()}
                                        onValueChange={(value) => setData('module_coordinator_id', parseInt(value))}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a coordinator" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employeeList.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.name || employee.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.module_coordinator_id} />
                                </div>

                                {/* Lecture */}
                                <div className="grid gap-2">
                                    <Label htmlFor="lecture_id">Lecture</Label>
                                    <Select
                                        value={data.lecture_id.toString()}
                                        onValueChange={(value) => setData('lecture_id', parseInt(value))}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a lecture" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employeeList.map((employee) => (
                                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                                    {employee.name || employee.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.lecture_id} />
                                </div>

                                {/* GPA Applicability */}
                                <div className="grid gap-2">
                                    <Label htmlFor="gpa_applicability">GPA Applicability</Label>
                                    <Select
                                        value={data.gpa_applicability}
                                        onValueChange={(value) => setData('gpa_applicability', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select GPA applicability" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GPA">GPA</SelectItem>
                                            <SelectItem value="NON_GPA">NON_GPA</SelectItem>
                                            <SelectItem value="GPA or NON_GPA">GPA or NON_GPA</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.gpa_applicability} />
                                </div>

                                {/* Offering Type */}
                                <div className="grid gap-2">
                                    <Label htmlFor="offering_type">Offering Type</Label>
                                    <Select
                                        value={data.offering_type}
                                        onValueChange={(value) => setData('offering_type', value)}
                                        disabled={isView || processing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select offering type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PROPER">PROPER</SelectItem>
                                            <SelectItem value="REPEAT">REPEAT</SelectItem>
                                            <SelectItem value="BOTH">BOTH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.offering_type} />
                                </div>

                                {!isView && (
                                    <Button type="submit" className="mt-4 w-fit cursor-pointer" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        {processing ? (isEdit ? 'Updating... ' : 'Creating...') : isEdit ? 'Update' : 'Create'} Batch Semester Module
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
