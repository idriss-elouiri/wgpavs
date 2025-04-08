import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AttendanceTable = ({ records = [], refreshData }) => {
  const getNestedValue = (obj, path, defaultValue = "N/A") => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || defaultValue;
  };

  const convertToEnglish = (value, type) => {
    if (type === "status") {
      return value === "حاضر" ? "Present" : value === "غائب" ? "Absent" : value;
    }
    if (type === "nationality") {
      return value === "سعودي" ? "Saudi" : value === "غير سعودي" ? "Non-Saudi" : value;
    }
    return value;
  };

  if (!records || records.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 text-center">
        <p className="text-gray-500">No attendance records found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 overflow-x-auto">
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">Attendance Records</h2>
      <ToastContainer />

      {/* Responsive Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-sm md:text-base">
            <tr>
              <th className="border p-2 md:p-3 text-left">Worker ID</th>
              <th className="border p-2 md:p-3 text-left">Worker Name</th>
              <th className="border p-2 md:p-3 text-left">Nationality</th>
              <th className="border p-2 md:p-3 text-left">Job Title</th>
              <th className="border p-2 md:p-3 text-left">Project</th>
              <th className="border p-2 md:p-3 text-left">Date</th>
              <th className="border p-2 md:p-3 text-left">Status</th>
              <th className="border p-2 md:p-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50 text-sm md:text-base">
                <td className="border p-2 md:p-3">{getNestedValue(record, "worker_id.id")}</td>
                <td className="border p-2 md:p-3">{record.worker_name || "N/A"}</td>
                <td className="border p-2 md:p-3">{convertToEnglish(record.nationality, "nationality") || "N/A"}</td>
                <td className="border p-2 md:p-3">{record.job_title || "N/A"}</td>
                <td className="border p-2 md:p-3">{getNestedValue(record, "project_id.name")}</td>
                <td className="border p-2 md:p-3">
                  {record.date ? new Date(record.date).toLocaleDateString() : "N/A"}
                </td>
                <td className="border p-2 md:p-3">
                  <span
                    className={`px-2 py-1 rounded inline-block ${
                      convertToEnglish(record.status, "status") === "Present"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {convertToEnglish(record.status, "status") || "N/A"}
                  </span>
                </td>
                <td className="border p-2 md:p-3">
                  {record.createdAt ? new Date(record.createdAt).toLocaleString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
