import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Link } from "@inertiajs/react";

interface ExamAdmission {
    id: number;
    module_name: string;
    module_code: string;
    exam_date: string;
    start_time: string;
    end_time: string;
    venue: string;
    student_group: string;
    created_at: string;
}

export const ExamAdmissionTableConfig = {
    columns: [
        {
            header: "Module Name",
            accessorKey: "module_name",
        },
        {
            header: "Module Code",
            accessorKey: "module_code",
        },
        {
            header: "Exam Date",
            accessorKey: "exam_date",
        },
        {
            header: "Start Time",
            accessorKey: "start_time",
        },
        {
            header: "End Time",
            accessorKey: "end_time",
        },
        {
            header: "Venue",
            accessorKey: "venue",
        },
        {
            header: "Student Group",
            accessorKey: "student_group",
        },
        {
            header: "Created At",
            accessorKey: "created_at",
        }
    ],
    actions: [
        {
            icon: <EyeIcon className="h-4 w-4" />,
            label: "View",
            onClick: (id: number) => {
                return route('exam-admissions.show', id);
            },
        },
        {
            icon: <PencilIcon className="h-4 w-4" />,
            label: "Edit",
            onClick: (id: number) => {
                return route('exam-admissions.edit', id);
            },
        },
        {
            icon: <TrashIcon className="h-4 w-4" />,
            label: "Delete",
            onClick: (id: number) => {
                return route('exam-admissions.destroy', id);
            },
        },
    ],
} as const;
