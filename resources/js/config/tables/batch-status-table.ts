export const BatchStatusTableConfig = {
  columns: [
    { label: 'Batch', key: 'batch', className: 'border p-4' },
    { label: 'Academic Year', key: 'academic_year', className: 'border p-4' },
    { label: 'Degree Year', key: 'degree_year', className: 'border p-4' },
    { label: 'Semester', key: 'semester', className: 'border p-4' },
    { label: 'Status', key: 'status', className: 'border p-4' },
    { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
  ],
  actions: [
    { label: 'View', icon: 'Eye', route: 'batch-statuses.show', className: 'cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90' },
    { label: 'Edit', icon: 'Pencil', route: 'batch-statuses.edit', className: 'ms-2 cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:opacity-90' },
    { label: 'Delete', icon: 'Trash2', route: 'batch-statuses.destroy', className: 'ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90' },
  ],
};
