export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden">
                <img 
                    src="/wimu.jpeg" 
                    alt="University of Ruhuna Logo" 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">University of Ruhuna</span>
            </div>
        </>
    );
}
