export const BatchTableConfig = {
    columns: [
        { label: 'Batch Name', key: 'batch_name', className: 'border p-4' },
        { label: 'Curriculum', key: 'curriculum', className: 'border p-4' },
        { label: 'Start Date', key: 'start_date', className: 'border p-4' },
        { label: 'Effective Date', key: 'effective_date', className: 'border p-4' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { 
            label: 'View', 
            icon: 'Eye', 
            route: 'batches.show', 
            className: 'cursor-pointer rounded-lg bg-sky-600 p-2 text-white hover:opacity-90' 
        },
        { 
            label: 'Edit', 
            icon: 'Pencil', 
            route: 'batches.edit', 
            className: 'ms-2 cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:opacity-90' 
        },
        { 
            label: 'Delete', 
            icon: 'Trash2', 
            route: 'batches.destroy', 
            className: 'ms-2 cursor-pointer rounded-lg bg-red-600 p-2 text-white hover:opacity-90' 
        },
    ],
};
