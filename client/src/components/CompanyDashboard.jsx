"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { FaEdit, FaTrash } from "react-icons/fa";
import SafetyReport from "./SafetyReport";
import AttendanceReport from "./AttendanceReport";
import { useSelector } from "react-redux";

Chart.register(...registerables);

const CompanyDashboard = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [contractors, setContractors] = useState([]);
  const [contractorsProject, setContractorsProject] = useState([]);
  const [projects, setProjects] = useState([]);
  const [attendanceReports, setAttendanceReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const companyId = currentUser?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractorsRes, projectsRes, reportsRes] = await Promise.all([
          fetch(`${apiUrl}/api/contractors/${companyId}`).then((res) => res.json()),
          fetch(`${apiUrl}/api/projects/company/${companyId}`).then((res) => res.json()),
          fetch(`${apiUrl}/api/attendance`).then((res) => res.json()),
        ]);

        setContractors(contractorsRes);
        setProjects(projectsRes);
        setAttendanceReports(reportsRes);
      } catch (err) {
        setError("An error occurred while fetching data");
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, companyId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contractorsRes = await fetch(
          `${apiUrl}/api/projects/project-counts?companyId=${companyId}`
        ).then((res) => res.json());

        setContractorsProject(contractorsRes);
      } catch (err) {
        setError("An error occurred while fetching data");
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, companyId]);

  const chartData = {
    labels: attendanceReports?.map((report) => report.project_name),
    datasets: [
      {
        label: "Attendance",
        data: attendanceReports?.map((report) => report.attendance_count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Absence",
        data: attendanceReports?.map((report) => report.absence_count),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Company Owner Dashboard</h1>

      {/* Project Management */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 overflow-x-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Project Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <thead>
              <tr className="bg-gray-200 text-sm md:text-base">
                <th className="border p-2 md:p-3 text-left">Company</th>
                <th className="border p-2 md:p-3 text-left">Project ID</th>
                <th className="border p-2 md:p-3 text-left">Project Name</th>
                <th className="border p-2 md:p-3 text-left">Location</th>
                <th className="border p-2 md:p-3 text-left">End User</th>
                <th className="border p-2 md:p-3 text-left">Project Status</th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((project) => (
                <tr key={project._id} className="border-b hover:bg-gray-50 text-sm md:text-base">
                  <td className="border p-2 md:p-3">{currentUser.name || "N/A"}</td>
                  <td className="border p-2 md:p-3">{project.project_number}</td>
                  <td className="border p-2 md:p-3">{project.name}</td>
                  <td className="border p-2 md:p-3">{project.location}</td>
                  <td className="border p-2 md:p-3">{project.contractor_id?.name || "N/A"}</td>
                  <td className="border p-2 md:p-3">{project.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SafetyReport />
      <AttendanceReport apiUrl={apiUrl} />
    </div>
  );
};

export default CompanyDashboard;
