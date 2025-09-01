import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface ModuleRow {
  module_code: string;
  module_name: string;
  credits: number;
  status: string;
  id: number;
}

export default function Index({ modules = [], filters = {}, student = null }: { modules?: ModuleRow[]; filters?: any; student?: any }) {
  const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
  const flashMessage = flash?.success || flash?.error;
  const [showAlert, setShowAlert] = useState(flash?.success || flash?.error ? true : false);
  const { data, setData } = useForm({ search: filters?.search || '' });
  const [tableData, setTableData] = useState<ModuleRow[]>(modules);

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => setShowAlert(false), 30000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);

  useEffect(() => {
    setTableData(modules);
  }, [modules]);

  const handleSearch = () => {
    // Use Inertia router to trigger backend search
    router.get('/stu-module-registers', { search: data.search });
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Student Module Registration', href: '/stu-module-registers' }]}> 
      <Head title="Student Module Registration" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        {showAlert && flashMessage && (
          <Alert variant={'default'} className={`${flash?.success ? 'bg-green-800' : flash?.error ? 'bg-red-800' : ''} ml-auto max-w-md text-white`}>
            <AlertDescription className="text-white">
              {flash.success ? 'Success!' : 'Error!'} 
              {flashMessage}
            </AlertDescription>
          </Alert>
        )}
        <div className="mb-4 flex w-full items-center gap-4">
          <Input
            type="text"
            value={data.search}
            onChange={e => setData('search', e.target.value)}
            className="h-10 w-1/2"
            placeholder="Type student number to search..."
            name="search"
          />
          <Button onClick={handleSearch} className="h-10 cursor-pointer bg-yellow-600 hover:bg-yellow-500 text-white">
            Search
          </Button>
        </div>
        {data.search && (
          <>
            {student ? (
              <div className="mb-4 rounded bg-gray-100 p-4 flex flex-col md:flex-row gap-4 items-center">
                <div><span className="font-bold">Name:</span> {student.name}</div>
                <div><span className="font-bold">Student No:</span> {student.student_id}</div>
                <div><span className="font-bold">Batch:</span> {student.batch_name}</div>
                <div><span className="font-bold">Semester:</span> {student.semester}</div>
              </div>
            ) : (
              <div className="mb-4 rounded bg-red-100 p-4 text-red-700 font-bold">Student not found.</div>
            )}
          <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="border p-4">#</th>
                  <th className="border p-4">Module Code</th>
                  <th className="border p-4">Module Name</th>
                  <th className="border p-4">Credit</th>
                  <th className="border p-4">Status</th>
                  <th className="border p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((mod, idx) => (
                    <tr key={mod.id}>
                      <td className="border px-4 py-2 text-center">{idx + 1}</td>
                      <td className="border px-4 py-2 text-center font-bold">{mod.module_code}</td>
                      <td className="border px-4 py-2 text-center">{mod.module_name}</td>
                      <td className="border px-4 py-2 text-center">{mod.credits}</td>
                      <td className="border px-4 py-2 text-center">
                        {mod.status === 'Registered' ? (
                          <span className="inline-block rounded bg-green-400 px-3 py-1 text-xs font-bold text-white">Registered</span>
                        ) : (
                          <span className="inline-block rounded bg-gray-400 px-3 py-1 text-xs font-bold text-white">Not Registered</span>
                        )}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {mod.status === 'Registered' ? (
                          <button className="rounded bg-green-400 px-4 py-1 text-white font-semibold cursor-not-allowed" disabled>Registered</button>
                        ) : (
                          <button
                            className="rounded bg-yellow-600 px-4 py-1 text-white font-semibold hover:bg-yellow-700"
                            onClick={() => {
                              router.post('/stu-module-registers/register', {
                                student_id: filters.search,
                                module_id: mod.id,
                              }, {
                                onSuccess: () => handleSearch(),
                                preserveScroll: true,
                                preserveState: false,
                              });
                            }}
                          >
                            Register
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-md py-4 text-center font-bold text-red-600">
                      No modules are offered for this semester.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
           
          </div>
           {/* Total module count */}
            {tableData.length > 0 && (
              <div className="w-full text-left p-2 font-semibold text-gray-700">
                Total modules: {tableData.length}
              </div>
            )}
        </>
        )}
      </div>
    </AppLayout>
  );
}
