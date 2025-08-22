export const AcademicAdvisorTableConfig = {
    columns: [
        { label: 'Student Name', key: 'student_name', className: 'border p-4' },
        { label: 'Student ID', key: 'student_id', className: 'border p-4' },
        { label: 'Academic Advisor', key: 'advisor_name', className: 'border p-4' },
        { label: 'Assigned Date', key: 'created_at', className: 'border p-4' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { label: 'View', icon: 'Eye' as const, route: 'academic-advisors.show', className: 'cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90' },
        { label: 'Edit', icon: 'Pencil' as const, route: 'academic-advisors.edit', className: 'ms-2 cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:opacity-90' },
        { label: 'Delete', icon: 'Trash2' as const, route: 'academic-advisors.destroy', className: 'ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90' },
    ],
};
