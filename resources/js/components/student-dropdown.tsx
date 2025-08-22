import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Users, ChevronDown, UserPlus, GraduationCap } from 'lucide-react';

interface StudentDropdownProps {
    className?: string;
}

export function StudentDropdown({ className }: StudentDropdownProps) {
    return (
        <div className={className}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between text-left font-normal">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Student Management</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem asChild>
                        <Link href="/academic-advisors" className="flex items-center">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Academic Advisor
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/students" className="flex items-center">
                            <GraduationCap className="mr-2 h-4 w-4" />
                            <span className="text-red-600">Pending</span>
                            {/* Student */}
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
