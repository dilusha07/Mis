import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { FileText, ChevronDown, Plus, Calendar, ClipboardList, BookOpen, Users, Settings } from 'lucide-react';

interface ModuleDropdownProps {
    className?: string;
}

export function ModuleDropdown({ className }: ModuleDropdownProps) {
    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-left font-normal">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Manage Modules</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem asChild>
                        <Link href="/modules" className="flex items-center">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Module
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/prerequisites" className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Prerequisites
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/batch-sem-modules" className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            module plan
                        </Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem asChild>
                        <Link href="/modules/create" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Module Settings
                        </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Semester Plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Examination Plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Student Enrollment
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
