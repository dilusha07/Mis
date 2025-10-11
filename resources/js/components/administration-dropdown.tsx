import { Link } from "@inertiajs/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { BookOpen, BrickWall, CalendarDays, ChevronDown, ListChecks, Users } from "lucide-react";
import { Button } from "./ui/button";

export function AdministrationDropdown({className ='',...props} :React.HTMLAttributes<HTMLDivElement>) {

 return (
    <div className={className} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-between text-left font-normal">
            <div className="flex items-center gap-2">
                <BrickWall className="h-4 w-4" />
                <span>Administration</span>
            </div>
            <ChevronDown className="h-4 w-4" />
         </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/curriculums">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Curriculums
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/academic-years">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Academic Years
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/batches">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Batches
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/batch-statuses">
              <span className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Batch Status
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}