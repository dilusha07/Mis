<?php

namespace App\Exports;

use App\Models\ExamPlan;
use App\Models\StuModuleRegister;
use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Font;

class ExamPlanExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $examPlanId;

    public function __construct($examPlanId)
    {
        $this->examPlanId = $examPlanId;
    }

    public function collection()
    {
        $examPlan = ExamPlan::with(['firstExaminer', 'secondExaminer', 'department', 'module'])
            ->findOrFail($this->examPlanId);

        // Get all students registered for this module with their details
        $students = StuModuleRegister::join('students', 'stu_module_registers.student_id', '=', 'students.student_id')
            ->where('stu_module_registers.module_id', $examPlan->module_id)
            ->select('stu_module_registers.*', 'students.full_name', 'students.first_name', 'students.last_name')
            ->get();

        // If no students found, return empty collection but still create the file
        if ($students->isEmpty()) {
            return collect([]);
        }

        return $students;
    }

    public function headings(): array
    {
        $examPlan = ExamPlan::with(['firstExaminer', 'secondExaminer', 'module'])
            ->findOrFail($this->examPlanId);

        $firstExaminerName = $examPlan->firstExaminer->full_name ?? 'N/A';
        $secondExaminerName = $examPlan->secondExaminer->full_name ?? 'N/A';

        $headings = [
            'Student ID',
            'Student Full Name',
        ];

        // Add Final Marks columns
        if ($examPlan->final_marks) {
            $finalMarks = is_string($examPlan->final_marks) ? json_decode($examPlan->final_marks, true) : $examPlan->final_marks;
            foreach ($finalMarks as $index => $mark) {
                $markName = $mark['name'] ?? "Final Mark " . ($index + 1);
                $headings[] = "1st Examiner - " . $markName;
                $headings[] = "2nd Examiner - " . $markName;
            }
        }

        // Add Mid Marks columns
        if ($examPlan->mid_marks) {
            $midMarks = is_string($examPlan->mid_marks) ? json_decode($examPlan->mid_marks, true) : $examPlan->mid_marks;
            foreach ($midMarks as $index => $mark) {
                $markName = $mark['name'] ?? "Mid Mark " . ($index + 1);
                $headings[] = "1st Examiner - " . $markName;
                $headings[] = "2nd Examiner - " . $markName;
            }
        }

        // Add CA Marks columns
        if ($examPlan->ca_marks) {
            $caMarks = is_string($examPlan->ca_marks) ? json_decode($examPlan->ca_marks, true) : $examPlan->ca_marks;
            foreach ($caMarks as $index => $mark) {
                $markName = $mark['name'] ?? "CA Mark " . ($index + 1);
                $headings[] = "1st Examiner - " . $markName;
                $headings[] = "2nd Examiner - " . $markName;
            }
        }

        // Add Other Marks columns
        if ($examPlan->other_marks) {
            $otherMarks = is_string($examPlan->other_marks) ? json_decode($examPlan->other_marks, true) : $examPlan->other_marks;
            foreach ($otherMarks as $index => $mark) {
                $markName = $mark['name'] ?? "Other Mark " . ($index + 1);
                $headings[] = "1st Examiner - " . $markName;
                $headings[] = "2nd Examiner - " . $markName;
            }
        }

        return $headings;
    }

    public function map($student): array
    {
        $examPlan = ExamPlan::with(['firstExaminer', 'secondExaminer', 'module'])
            ->findOrFail($this->examPlanId);

        // Get student name from joined data
        $studentName = $student->full_name ?? 
                      ($student->first_name . ' ' . $student->last_name) ?? 
                      'N/A';

        $row = [
            $student->student_id,
            $studentName,
        ];

        // Add Final Marks columns
        if ($examPlan->final_marks) {
            $finalMarks = is_string($examPlan->final_marks) ? json_decode($examPlan->final_marks, true) : $examPlan->final_marks;
            foreach ($finalMarks as $mark) {
                $row[] = ''; // 1st Examiner mark (empty for now)
                $row[] = ''; // 2nd Examiner mark (empty for now)
            }
        }

        // Add Mid Marks columns
        if ($examPlan->mid_marks) {
            $midMarks = is_string($examPlan->mid_marks) ? json_decode($examPlan->mid_marks, true) : $examPlan->mid_marks;
            foreach ($midMarks as $mark) {
                $row[] = ''; // 1st Examiner mark (empty for now)
                $row[] = ''; // 2nd Examiner mark (empty for now)
            }
        }

        // Add CA Marks columns
        if ($examPlan->ca_marks) {
            $caMarks = is_string($examPlan->ca_marks) ? json_decode($examPlan->ca_marks, true) : $examPlan->ca_marks;
            foreach ($caMarks as $mark) {
                $row[] = ''; // 1st Examiner mark (empty for now)
                $row[] = ''; // 2nd Examiner mark (empty for now)
            }
        }

        // Add Other Marks columns
        if ($examPlan->other_marks) {
            $otherMarks = is_string($examPlan->other_marks) ? json_decode($examPlan->other_marks, true) : $examPlan->other_marks;
            foreach ($otherMarks as $mark) {
                $row[] = ''; // 1st Examiner mark (empty for now)
                $row[] = ''; // 2nd Examiner mark (empty for now)
            }
        }

        return $row;
    }

    public function styles(Worksheet $sheet)
    {
        $examPlan = ExamPlan::with(['firstExaminer', 'secondExaminer', 'module'])
            ->findOrFail($this->examPlanId);

        // Style the header row
        $sheet->getStyle('A1:' . $sheet->getHighestColumn() . '1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Add exam plan information at the top
        $sheet->insertNewRowBefore(1, 4);
        
        $sheet->setCellValue('A1', 'Exam Plan Details');
        $sheet->mergeCells('A1:' . $sheet->getHighestColumn() . '1');
        $sheet->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 14],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);

        $sheet->setCellValue('A2', 'Module: ' . ($examPlan->module->module_name ?? 'N/A') . ' (' . ($examPlan->module->module_code ?? 'N/A') . ')');
        $sheet->mergeCells('A2:' . $sheet->getHighestColumn() . '2');
        
        $sheet->setCellValue('A3', 'First Examiner: ' . ($examPlan->firstExaminer->full_name ?? 'N/A'));
        $sheet->mergeCells('A3:' . $sheet->getHighestColumn() . '3');
        
        $sheet->setCellValue('A4', 'Second Examiner: ' . ($examPlan->secondExaminer->full_name ?? 'N/A'));
        $sheet->mergeCells('A4:' . $sheet->getHighestColumn() . '4');



        // Style the info rows
        $sheet->getStyle('A2:A4')->applyFromArray([
            'font' => ['bold' => true],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT],
        ]);

        // Style all cells (only if there's data)
        if ($sheet->getHighestRow() > 5) {
            $sheet->getStyle('A5:' . $sheet->getHighestColumn() . $sheet->getHighestRow())->applyFromArray([
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
            ]);
        }

        return $sheet;
    }
}
