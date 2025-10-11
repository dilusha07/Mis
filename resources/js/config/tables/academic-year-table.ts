export const AcademicYearTableConfig = {
    columns: [
        { label: 'Academic Year', key: 'academic_year', className: 'border p-4' },
        { label: 'Curriculum', key: 'curriculum', className: 'border p-4' },
        { label: 'Start Date', key: 'year_begin', className: 'border p-4' },
        { label: 'End Date', key: 'year_end', className: 'border p-4' },
        { label: 'Status', key: 'status', className: 'border p-4' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { label: 'View', icon: 'Eye', route: 'academic-years.show', className: 'cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90' },
        { label: 'Edit', icon: 'Pencil', route: 'academic-years.edit', className: 'ms-2 cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:opacity-90' },
        { label: 'Delete', icon: 'Trash2', route: 'academic-years.destroy', className: 'ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90' },
    ],
};
