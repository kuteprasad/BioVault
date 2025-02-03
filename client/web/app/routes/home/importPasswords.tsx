import { useState, useRef } from 'react';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { useNavigate } from 'react-router';

interface ImportedPassword {
  name: string;
  url: string;
  username: string;
  password: string;
  note: string;
}

export default function ImportPasswords() {
  const [passwords, setPasswords] = useState<ImportedPassword[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleFile = async (file: File) => {
    if (file.type !== 'text/csv') {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsLoading(true);
    try {
      Papa.parse(file, {
        complete: (results) => {
          const parsedPasswords = results.data
            .slice(1) // Skip header row
            .map((row: any) => ({
              name: row[0] || 'Untitled',
              url: row[1],
              username: row[2],
              password: row[3],
              note: row[4] || ''
            }))
            .filter((pass: ImportedPassword) => 
              pass.url && pass.username && pass.password
            );

          setPasswords(parsedPasswords);
          setHasFile(true);
          toast.success(`Found ${parsedPasswords.length} passwords`);
        },
        error: () => toast.error('Failed to parse CSV file'),
      });
    } catch (error) {
      toast.error('Error processing file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      // API call to save passwords
      // await savePasswords(passwords);

      console.log("saved passwords", passwords);
      
      toast.success('Passwords imported successfully');
      // navigate('/');
    } catch (error) {
      toast.error('Failed to import passwords');
    }
    setIsLoading(false);
  };

  const resetUpload = () => {
    setPasswords([]);
    setHasFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className=" p-8 bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Show header only when no file is uploaded */}
        {!hasFile && (
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Import Passwords</h1>
            <p className="text-gray-500">Import your passwords from Chrome or other browsers</p>
          </div>
        )}

        {!hasFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 border-2 border-dashed rounded-xl text-center space-y-4 
              cursor-pointer transition-colors duration-200 ${
                isDragging 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-500'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Upload className="mx-auto h-12 w-12 text-purple-500" />
            <div>
              <p className="text-gray-600">
                {isDragging
                  ? 'Drop your CSV file here'
                  : 'Drag & drop your CSV file here, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports Chrome exported passwords
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Preview Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Preview ({passwords.length} passwords)
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={resetUpload}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg 
                      hover:bg-gray-200 transition-colors duration-200"
                  >
                    Upload Different File
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 
                      text-white rounded-lg hover:bg-purple-700 transition-colors 
                      duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      'Importing...'
                    ) : (
                      <>
                        <FileCheck className="h-5 w-5" />
                        Import Passwords
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium 
                      text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium 
                      text-gray-500 uppercase tracking-wider">URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium 
                      text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium 
                      text-gray-500 uppercase tracking-wider">Password</th>
                    <th className="px-6 py-3 text-left text-xs font-medium 
                      text-gray-500 uppercase tracking-wider">Note</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {passwords.map((pass, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-[200px]">
                        {pass.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-[200px]">
                        {pass.url}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {pass.username}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ••••••••
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-[200px]">
                        {pass.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}