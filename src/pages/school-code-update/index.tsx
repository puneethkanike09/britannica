import React, { useEffect, useState } from 'react';
import { SchoolCodeUpdateService } from '../../services/school-code-update/schoolCodeUpdateService';
import { SchoolWithTempCode } from '../../types/school-code-update';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';


const SchoolCodeUpdate: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [schools, setSchools] = useState<SchoolWithTempCode[]>([]);
    const [schoolCodes, setSchoolCodes] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        setIsLoading(true);
        try {
            const response = await SchoolCodeUpdateService.fetchSchools();
            if (response.error === false) {
                const schoolsWithCode = response.school.map(school => ({
                    ...school,
                    tempSchoolCode: school.school_code || ''
                }));
                // Initialize schoolCodes Set with existing codes
                const existingCodes = new Set(
                    response.school
                        .filter(school => school.school_code)
                        .map(school => school.school_code as string)
                );
                setSchoolCodes(existingCodes);
                setSchools(schoolsWithCode);
            } else {
                toast.error(response.message ?? 'Failed to fetch schools');
            }
        } catch (error) {
            toast.error('Failed to fetch schools');
            console.error('Fetch schools error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSchoolCodeChange = (index: number, value: string) => {
        const newSchools = [...schools];
        const oldCode = newSchools[index].tempSchoolCode;
        newSchools[index].tempSchoolCode = value;
        setSchools(newSchools);

        // Update unique codes set
        const newCodes = new Set(schoolCodes);
        if (oldCode) {
            newCodes.delete(oldCode); // Remove old code
        }
        if (value) {
            newCodes.add(value);
        }
        setSchoolCodes(newCodes);
    };

    const isValidSchoolCode = (code: string): boolean => {
        return /^[a-zA-Z0-9]{11,20}$/.test(code);
    };

    const isSchoolCodeDuplicate = (code: string, currentIndex: number) => {
        return schools.some(
            (school, index) =>
                index !== currentIndex &&
                school.tempSchoolCode === code &&
                code !== ''
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields are filled and have valid format
        const invalidSchools = schools.filter(school => {
            const code = school.tempSchoolCode.trim();
            return !code || !isValidSchoolCode(code);
        });

        if (invalidSchools.length > 0) {
            if (invalidSchools.some(school => !school.tempSchoolCode.trim())) {
                toast.error('Please fill in all school codes');
            } else {
                toast.error('School codes must be 11-20 alphanumeric characters');
            }
            return;
        }

        // Validate for duplicates
        const hasDuplicates = schools.some(
            (school, index) => isSchoolCodeDuplicate(school.tempSchoolCode, index)
        );
        if (hasDuplicates) {
            toast.error('Each school code must be unique');
            return;
        }

        // Prepare data for API call
        const updates = schools.map(school => ({
            school_id: school.school_id,
            school_code: school.tempSchoolCode
        }));

        setIsSubmitting(true);
        try {
            const response = await SchoolCodeUpdateService.updateSchoolCodes(updates);
            if (!response.error) {
                toast.success(response.message);
                // Redirect or handle success as needed
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error('Failed to update school codes');
            console.error('Update school codes error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const completedCount = schools.filter(school => school.tempSchoolCode.trim()).length;

    return (
        <div className="max-w-full mx-auto rounded-lg sm:p-7 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">School Code Update ( {schools.length} )</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-textColor">
                        <span className="font-bold">{completedCount}</span> of <span className="font-bold">{schools.length}</span> completed
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <div className="overflow-x-auto w-full rounded-lg">
                        <table className="w-full min-w-[1000px]">
                            <colgroup>
                                <col className="w-[25%] min-w-[250px]" />
                                <col className="w-[25%] min-w-[200px]" />
                                <col className="w-[25%] min-w-[250px]" />
                                <col className="w-[25%] min-w-[200px]" />
                            </colgroup>
                            <thead>
                                <tr className="bg-secondary text-white">
                                    <th className="px-8 py-4 text-left border-r-1 border-white font-black">School Name</th>
                                    <th className="px-8 py-4 text-left border-r-1 border-white font-black">Email Address</th>
                                    <th className="px-8 py-4 text-left border-r-1 border-white font-black">Address</th>
                                    <th className="px-8 py-4 text-left font-black">School Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-16">
                                            <Loader message="Loading school data..." />
                                        </td>
                                    </tr>
                                ) : schools.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-16 text-center text-textColor">
                                            No schools found.
                                        </td>
                                    </tr>
                                ) : (
                                    schools.map((school, index) => (
                                        <tr key={school.school_id} className={index % 2 === 1 ? "bg-third" : "bg-white"}>
                                            <td className="px-8 py-4 break-words">
                                                <div className="text-textColor font-medium">{school.school_name || '-'}</div>
                                                <div className="text-sm text-gray-500 mt-1">ID: {school.school_id}</div>
                                            </td>
                                            <td className="px-8 py-4 break-all">
                                                <div className="text-textColor">{school.school_email || '-'}</div>
                                            </td>
                                            <td className="px-8 py-4 break-words">
                                                <div className="text-textColor" title={school.school_address}>
                                                    {school.school_address || '-'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={school.tempSchoolCode}
                                                        onChange={(e) => handleSchoolCodeChange(index, e.target.value)}
                                                        className={`
                                                            w-full p-3 text-textColor border rounded-lg text-base bg-inputBg border-inputBorder 
                                                            placeholder:text-inputPlaceholder focus:outline-none focus:border-primary
                                                            ${isSchoolCodeDuplicate(school.tempSchoolCode, index)
                                                                ? 'border-red-500 bg-red-50'
                                                                : school.tempSchoolCode
                                                                    ? isValidSchoolCode(school.tempSchoolCode)
                                                                        ? 'border-green-500 bg-green-50'
                                                                        : 'border-red-500 bg-red-50'
                                                                    : ''
                                                            }
                                                        `}
                                                        placeholder="Enter school code (11-20 alphanumeric characters)"
                                                        pattern="^[a-zA-Z0-9]{11,20}$"
                                                        title="School code must be 11-20 alphanumeric characters"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                    {school.tempSchoolCode && (
                                                        <>
                                                            {isSchoolCodeDuplicate(school.tempSchoolCode, index) ? (
                                                                <div className="flex items-center gap-1 text-red-600">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                                    </svg>
                                                                    <span className="text-xs font-medium">This code is already used</span>
                                                                </div>
                                                            ) : !isValidSchoolCode(school.tempSchoolCode) ? (
                                                                <div className="flex items-center gap-1 text-red-600">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                                    </svg>
                                                                    <span className="text-xs font-medium">Must be 11-20 alphanumeric characters</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1 text-green-600">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    <span className="text-xs font-medium">Valid code</span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Submit Button */}
                    {!isLoading && schools.length > 0 && (
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-primary hover:bg-hover text-white px-8 py-3 font-bold rounded-lg flex items-center gap-2 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="font-bold">Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <span className="font-bold">Update School Codes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SchoolCodeUpdate;