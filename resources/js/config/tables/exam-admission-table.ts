export const ExamAdmissionTableConfig = {
    columns: [
        { label: 'Module Name', key: 'module_name', className: 'border p-4' },
        { label: 'Module Code', key: 'module_code', className: 'border p-4' },
        { label: 'Semester', key: 'semester', className: 'border p-4' },
        { label: 'Exam Date', key: 'exam_date', className: 'border p-4' },
        { label: 'Start Time', key: 'start_time', className: 'border p-4' },
        { label: 'End Time', key: 'end_time', className: 'border p-4' },
        { label: 'Venue', key: 'venue', className: 'border p-4' },
        { label: 'Student Group', key: 'student_group', className: 'border p-4' },
        { label: 'Created Date', key: 'created_at', className: 'border p-4' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { label: 'View', icon: 'Eye' as const, route: 'exam-admissions.show', className: 'cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90' },
        { label: 'Edit', icon: 'Pencil' as const, route: 'exam-admissions.edit', className: 'ms-2 cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:opacity-90' },
        { label: 'Delete', icon: 'Trash2' as const, route: 'exam-admissions.destroy', className: 'ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90' },
    ],
};
