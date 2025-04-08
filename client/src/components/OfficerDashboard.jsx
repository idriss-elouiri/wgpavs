"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SafetyOfficerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [safetyStats, setSafetyStats] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/projects`);
      const data = await res.json();
      if (res.ok) setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchSafetyStats = async (projectId) => {
    try {
      const res = await fetch(`${apiUrl}/api/projects/${projectId}/safety-stats`);
      const data = await res.json();
      if (res.ok) setSafetyStats(data);
    } catch (error) {
      console.error("Error fetching safety stats:", error);
    }
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    if (projectId) {
      fetchSafetyStats(projectId);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mx-2 sm:mx-4 lg:mx-8 my-4">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-start">
        لوحة تحكم ضابط السلامة
      </h3>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2 text-sm sm:text-base">
          اختر مشروعًا:
        </label>
        <select
          value={selectedProject}
          onChange={handleProjectChange}
          className="block w-full p-2 border border-gray-300 rounded text-sm sm:text-base focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">اختر مشروعًا</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <div className="mt-6 overflow-x-auto">
          <h4 className="text-md sm:text-lg font-medium mb-3 text-center sm:text-start">
            إحصائيات السلامة
          </h4>
          <div className="min-w-full overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full table-auto border-collapse text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 sm:p-3 text-left whitespace-nowrap">النوع</th>
                  <th className="border p-2 sm:p-3 text-left whitespace-nowrap">عدد الحوادث</th>
                  <th className="border p-2 sm:p-3 text-left whitespace-nowrap">عدد الملاحظات</th>
                  <th className="border p-2 sm:p-3 text-left whitespace-nowrap">عدد التحقيقات</th>
                </tr>
              </thead>
              <tbody>
                {safetyStats.map((stat, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2 sm:p-3">{stat.type}</td>
                    <td className="border p-2 sm:p-3">{stat.incidents}</td>
                    <td className="border p-2 sm:p-3">{stat.observations}</td>
                    <td className="border p-2 sm:p-3">{stat.investigations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyOfficerDashboard;
