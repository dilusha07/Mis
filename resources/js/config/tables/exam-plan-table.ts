export const ExamPlanTableConfig = {
    columns: [
        { label: 'First Examiner', key: 'first_examiner', className: 'border p-4' },
        { label: 'Second Examiner', key: 'second_examiner', className: 'border p-4' },
        { label: 'Department', key: 'department', className: 'border p-4' },
        { label: 'Module', key: 'module', className: 'border p-4' },
        { label: 'Module Code', key: 'module_code', className: 'border p-4' },
        { label: 'Created Date', key: 'created_at', className: 'border p-4' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { label: 'View', icon: 'Eye' as const, route: 'exam-plans.show', className: 'cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90' },
        { label: 'Edit', icon: 'Pencil' as const, route: 'exam-plans.edit', className: 'ms-2 cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:opacity-90' },
        { label: 'Download Excel', icon: 'FileDown' as const, route: 'exam-plans.download-excel', className: 'ms-2 cursor-pointer rounded-lg bg-green-600 p-2 text-white hover:opacity-90' },
        { label: 'Delete', icon: 'Trash2' as const, route: 'exam-plans.destroy', className: 'ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90' },
    ],
};
