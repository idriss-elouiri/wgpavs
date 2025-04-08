import React, { useState, useEffect } from "react";

const AttendanceReport = ({ apiUrl }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/attendance`);
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [apiUrl]);

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Attendance Report</h2>
      
      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-gray-200 text-sm md:text-base">
              <th className="p-2 md:p-3 text-left">Project Name</th>
              <th className="p-2 md:p-3 text-left">Date</th>
              <th className="p-2 md:p-3 text-left">Attendance Count</th>
              <th className="p-2 md:p-3 text-left">Absence Count</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((report) => (
              <tr key={report._id} className="border-b hover:bg-gray-50 text-sm md:text-base">
                <td className="p-2 md:p-3">{report.project_name || "N/A"}</td>
                <td className="p-2 md:p-3">
                  {report.date ? new Date(report.date).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-2 md:p-3">{report.attendance_count || "N/A"}</td>
                <td className="p-2 md:p-3">{report.absence_count || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;
