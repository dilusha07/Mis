import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import React from 'react';

interface Module {
    id: number;
    module_name: string;
    module_code: string;
    department_id?: number;
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

interface ModulePrerequisite {
    id: number;
    module_id: number;
    pre_module_ids: number[];
    module?: Module;
    curriculum_id?: number;
}

interface Department {
    id: number;
    dept_name: string;
    dept_code: string;
}

interface BatchSemModuleFormProps {
    batchSemModule?: BatchSemModule;
    modules: Module[];
    lecturers?: Employee[];
    employees?: Employee[];
    batchStatuses?: BatchStatus[];
    batchStatusesAll?: BatchStatus[];
    batches?: Batch[];
    modulePrerequisites?: ModulePrerequisite[];
    departments?: Department[];
    isView?: boolean;
    isEdit?: boolean;
}

export default function BatchSemModuleForm({
    batchSemModule,
    modules,
    employees,
    lecturers,
    batchStatuses,
    batchStatusesAll,
    batches,
    modulePrerequisites,
    departments = [],
    isView,
    isEdit
}: BatchSemModuleFormProps) {
    // Use employees or lecturers, whichever is provided
    const employeeList = employees || lecturers || [];
    // Use batchStatuses or extract unique status names from batchStatusesAll
    const batchStatusList = batchStatuses || (batchStatusesAll ?
        batchStatusesAll.map(status => ({
            id: status.id,
            status_name: `${status.semester} - ${status.status}`
        })) : []);

    // Create a map of department IDs to department names for easier lookups
    const departmentMap = React.useMemo(() => {
        const map = new Map();
        departments.forEach(dept => {
            map.set(dept.id, {
                name: dept.dept_name,
                code: dept.dept_code
            });
        });
        return map;
    }, [departments]);
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

    // State to track whether to show other modules from the same department
    const [showSameDeptModules, setShowSameDeptModules] = React.useState<boolean>(false);

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

    // Get modules by department for better organization
    const modulesByDepartment = React.useMemo(() => {
        const departmentMap = new Map();

        modules.forEach(module => {
            if (module.department_id) {
                if (!departmentMap.has(module.department_id)) {
                    departmentMap.set(module.department_id, []);
                }
                departmentMap.get(module.department_id).push(module);
            }
        });

        return departmentMap;
    }, [modules]);

    // Find module prerequisites when module changes
    const [existingPrerequisites, setExistingPrerequisites] = React.useState<number[]>([]);

    React.useEffect(() => {
        // Reset display options when module changes
        setShowSameDeptModules(false);

        // Find any existing prerequisites for this module
        if (data.module_id && modulePrerequisites) {
            const prereq = modulePrerequisites.find(p => p.module_id === Number(data.module_id));
            if (prereq && Array.isArray(prereq.pre_module_ids)) {
                setExistingPrerequisites(prereq.pre_module_ids);

                // Pre-select the prerequisites
                setData('prerequisites', prereq.pre_module_ids);
            } else {
                setExistingPrerequisites([]);
            }
        } else {
            setExistingPrerequisites([]);
        }
    }, [data.module_id, modulePrerequisites]);

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
                        <form onSubmit={submit} className="flex flex-col gap-6" autoComplete="off">
                            {/* Batch & Semester Section - Moved to top */}
                            <div className="border rounded-md p-4 bg-slate-50 shadow-sm">
                                <h3 className="font-medium text-lg mb-4 pb-2 border-b text-indigo-700">Batch & Semester</h3>
                                <div className="grid gap-4">
                                    {/* Batch Selection */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="batch_id" className="font-medium">Batch</Label>
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
                                        <div className="rounded bg-indigo-50 p-3 text-indigo-800 border border-indigo-100">
                                            <p className="font-medium">Semester: <span className="text-indigo-600">{selectedSemester}</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Module Information Section */}
                            <div className="border rounded-md p-4 bg-slate-50 shadow-sm">
                                <h3 className="font-medium text-lg mb-4 pb-2 border-b text-indigo-700">Module Information</h3>
                                <div className="grid gap-4">
                                    {/* Module Selection */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="module_id" className="font-medium">Module</Label>
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
                                </div>
                            </div>

                            {/* Prerequisites Section */}
                            <div className="border rounded-md p-4 bg-slate-50 shadow-sm">
                                <h3 className="font-medium text-lg mb-4 pb-2 border-b text-indigo-700">Prerequisites</h3>
                                <div className="grid gap-2">
                                    <Label className="font-medium">Prerequisite Modules</Label>

                                    {/* Display department-specific prerequisites only if a module is selected */}
                                    {data.module_id && (
                                        <React.Fragment>
                                            {/* Show existing prerequisites notice if any */}
                                            {existingPrerequisites.length > 0 && (
                                                <Alert className="mb-4 bg-blue-50 border-blue-200">
                                                    <InfoIcon className="h-4 w-4 text-blue-700" />
                                                    <AlertDescription className="text-blue-700">
                                                        <p className="font-medium">This module has {existingPrerequisites.length} existing prerequisite{existingPrerequisites.length > 1 ? 's' : ''} shown below.</p>
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {/* Display only existing prerequisites first */}
                                            {(() => {
                                                const selectedModule = modules.find(mod => mod.id === Number(data.module_id));
                                                if (!selectedModule) return null;

                                                // Get department info
                                                const departmentInfo = departmentMap.get(selectedModule.department_id);
                                                const departmentName = departmentInfo
                                                    ? departmentInfo.name
                                                    : selectedModule.module_code?.split(' ')[0] + ' Department';

                                                return (
                                                    <div>
                                                        <h4 className="text-sm font-medium text-slate-500">
                                                            {departmentInfo?.code && (
                                                                <Badge variant="outline" className="mr-2">{departmentInfo.code}</Badge>
                                                            )}
                                                            Current Prerequisites
                                                        </h4>
                                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-3 border p-2 rounded">
                                                            {existingPrerequisites.length > 0 ? (
                                                                modules
                                                                    .filter(m =>
                                                                        existingPrerequisites.includes(m.id)
                                                                    )
                                                                    .map(module => {
                                                                        const checked = Array.isArray(data.prerequisites) &&
                                                                            data.prerequisites.includes(module.id);

                                                                        return (
                                                                            <label key={module.id} className="flex items-center gap-2 bg-blue-50 p-1 rounded border border-blue-200">
                                                                                <Checkbox
                                                                                    checked={checked}
                                                                                    disabled={isView || processing}
                                                                                    onCheckedChange={(val) => {
                                                                                        const isChecked = Boolean(val);
                                                                                        let current = Array.isArray(data.prerequisites) ?
                                                                                            [...data.prerequisites].map(Number) : [];

                                                                                        if (isChecked) {
                                                                                            const moduleId = Number(module.id);
                                                                                            if (!current.includes(moduleId)) current.push(moduleId);
                                                                                        } else {
                                                                                            current = current.filter(id => id !== Number(module.id));
                                                                                        }

                                                                                        setData('prerequisites', current);
                                                                                    }}
                                                                                />
                                                                                <div>
                                                                                    <span>{module.module_code} - {module.module_name}</span>
                                                                                    <Badge className="ml-2 text-xs" variant="secondary">Current Prerequisite</Badge>
                                                                                </div>
                                                                            </label>
                                                                        );
                                                                    })
                                                            ) : (
                                                                <div className="col-span-2 text-center text-slate-500 py-3">
                                                                    No prerequisites defined for this module
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Add from Same Department button */}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="mb-2"
                                                onClick={() => setShowSameDeptModules(prev => !prev)}
                                            >
                                                {showSameDeptModules ? "Hide Same Department Modules" : "Add from Same Department"}
                                            </Button>

                                            {/* Display other modules from same department when requested */}
                                            {showSameDeptModules && (() => {
                                                const selectedModule = modules.find(mod => mod.id === Number(data.module_id));
                                                if (!selectedModule) return null;

                                                // Get department info
                                                const departmentInfo = departmentMap.get(selectedModule.department_id);
                                                const departmentName = departmentInfo
                                                    ? departmentInfo.name
                                                    : selectedModule.module_code?.split(' ')[0] + ' Department';

                                                return (
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-slate-500">
                                                            {departmentInfo?.code && (
                                                                <Badge variant="outline" className="mr-2">{departmentInfo.code}</Badge>
                                                            )}
                                                            Other {departmentName} Modules
                                                        </h4>
                                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 border p-2 rounded mt-1">
                                                            {modules
                                                                .filter(m =>
                                                                    m.id !== Number(data.module_id) &&
                                                                    m.department_id === selectedModule.department_id &&
                                                                    !existingPrerequisites.includes(m.id)
                                                                )
                                                                .map(module => {
                                                                    const checked = Array.isArray(data.prerequisites) &&
                                                                        data.prerequisites.includes(module.id);

                                                                    return (
                                                                        <label key={module.id} className="flex items-center gap-2">
                                                                            <Checkbox
                                                                                checked={checked}
                                                                                disabled={isView || processing}
                                                                                onCheckedChange={(val) => {
                                                                                    const isChecked = Boolean(val);
                                                                                    let current = Array.isArray(data.prerequisites) ?
                                                                                        [...data.prerequisites].map(Number) : [];

                                                                                    if (isChecked) {
                                                                                        const moduleId = Number(module.id);
                                                                                        if (!current.includes(moduleId)) current.push(moduleId);
                                                                                    } else {
                                                                                        current = current.filter(id => id !== Number(module.id));
                                                                                    }

                                                                                    setData('prerequisites', current);
                                                                                }}
                                                                            />
                                                                            <span>{module.module_code} - {module.module_name}</span>
                                                                        </label>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                );
                                            })()}


                                        </React.Fragment>
                                    )}

                                    {!data.module_id && (
                                        <div className="bg-amber-50 p-3 rounded text-amber-700 text-sm">
                                            Please select a module first to see relevant prerequisites.
                                        </div>
                                    )}

                                    <InputError message={errors.prerequisites} />
                                </div>
                            </div>

                            {/* Instructors Section */}
                            <div className="border rounded-md p-4 bg-slate-50 shadow-sm">
                                <h3 className="font-medium text-lg mb-4 pb-2 border-b text-indigo-700">Instructors</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Module Coordinator */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="module_coordinator_id" className="font-medium">Module Coordinator</Label>
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
                                        <Label htmlFor="lecture_id" className="font-medium">Lecturer</Label>
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
                                </div>
                            </div>

                            {/* Additional Settings Section */}
                            <div className="border rounded-md p-4 bg-slate-50 shadow-sm">
                                <h3 className="font-medium text-lg mb-4 pb-2 border-b text-indigo-700">Additional Settings</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* GPA Applicability */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="gpa_applicability" className="font-medium">GPA Applicability</Label>
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
                                        <Label htmlFor="offering_type" className="font-medium">Offering Type</Label>
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
                                </div>
                            </div>

                            {/* Submit Button */}
                            {!isView && (
                                <Button type="submit" className="mt-2 w-fit cursor-pointer" disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    {processing ? (isEdit ? 'Updating... ' : 'Creating...') : isEdit ? 'Update' : 'Create'} Batch Semester Module
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
