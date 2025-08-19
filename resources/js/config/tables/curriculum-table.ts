export const CurriculumTableConfig = {
    columns: [
        { label: 'Curriculum Code', key: 'curriculum_code', className: 'border p-4' },
        { label: 'Curriculum Name', key: 'curriculum_name', className: 'w-90 border p-4' },
        { label: 'Start Date', key: 'start_date', className: 'border p-4' },
        { label: 'Start Batch From', key: 'start_batch_from', className: 'border p-4' },
        { label: 'End Batch To', key: 'end_batch_to', className: 'border p-4' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { label: 'View', icon: 'Eye', route: 'curriculums.show', className: 'cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90' },
        { label: 'Edit', icon: 'Pencil', route: 'curriculums.edit', className: 'ms-2 cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:opacity-90' },
        { label: 'Delete', icon: 'Trash2', route: 'curriculums.destroy', className: 'ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90' },
    ],
};