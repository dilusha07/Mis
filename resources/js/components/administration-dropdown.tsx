import { Link, usePage } from "@inertiajs/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { BrickWall, ChevronDown } from "lucide-react";

export function AdministrationDropdown() {
    const { url: currentUrl } = usePage<{ url: string }>().props;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex w-full justify-between items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                    <div className="flex items-center gap-2">
                        <BrickWall className="size-4" />
                        Administration
                    </div>
                    <ChevronDown className="size-4 transition-transform data-[state=open]:rotate-180" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mt-1 min-w-[12rem] bg-background border rounded-md shadow-md">
                <DropdownMenuItem asChild>
                    <Link
                        href="/curriculums"
                        className={`w-full block px-3 py-2 text-sm rounded hover:bg-accent hover:text-accent-foreground ${
                            currentUrl === '/curriculums' ? 'font-semibold bg-accent' : ''
                        }`}
                    >
                        Curriculums
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        href="/academic-years"
                        className={`w-full block px-3 py-2 text-sm rounded hover:bg-accent hover:text-accent-foreground ${
                            currentUrl === '/academic-years' ? 'font-semibold bg-accent' : ''
                        }`}
                    >
                        Academic Years
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        href="/batches"
                        className={`w-full block px-3 py-2 text-sm rounded hover:bg-accent hover:text-accent-foreground ${
                            currentUrl === '/batches' ? 'font-semibold bg-accent' : ''
                        }`}
                    >
                        Batches
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}