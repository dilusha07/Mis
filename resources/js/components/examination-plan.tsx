import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { FileText, ChevronDown, Calendar, BarChart3 } from 'lucide-react';

interface ExaminationPlanDropdownProps {
    className?: string;
}

export function ExaminationPlanDropdown({ className }: ExaminationPlanDropdownProps) {
    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-left font-normal">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Examination Management</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem asChild>
                        <Link href="/exam-admissions" className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            Plan Exam
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/examination-results" className="flex items-center">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Results
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
