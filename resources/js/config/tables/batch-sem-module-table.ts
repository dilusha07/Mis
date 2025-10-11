export const BatchSemModuleTableConfig = {
    columns: [
        { label: 'Module Name', key: 'module_name', className: 'border p-4' },
        { label: 'Module Code', key: 'module_code', className: 'border p-4' },
        { label: 'Semester', key: 'semester', className: 'border p-4' },
        { label: 'Module Type', key: 'module_type', className: 'border p-4' },
        { label: 'GPA Applicability', key: 'gpa_applicability', className: 'border p-4' },
        { label: 'Module Coordinator', key: 'module_coordinator', className: 'border p-4' },
        { label: 'Lecture', key: 'lecture', className: 'border p-4' },
        { label: 'Created Date', key: 'created_at', className: 'border p-4' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { label: 'View', icon: 'Eye' as const, route: 'batch-sem-modules.show', className: 'cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90' },
        { label: 'Edit', icon: 'Pencil' as const, route: 'batch-sem-modules.edit', className: 'ms-2 cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:opacity-90' },
        { label: 'Delete', icon: 'Trash2' as const, route: 'batch-sem-modules.destroy', className: 'ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90' },
    ],
};
