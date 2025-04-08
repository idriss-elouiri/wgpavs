"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

Chart.register(...registerables);

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const fetchData = async (endpoint) => {
  const res = await fetch(`${apiUrl}${endpoint}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

const ContractorDashboard = () => {
  const [activeTab, setActiveTab] = useState("workforce");
  const { currentUser } = useSelector((state) => state.user);
  const selectedCompany = currentUser?._id;

  const {
    data: contractors = [],
    isLoading: contractorsLoading,
    isError: contractorsError,
  } = useQuery({
    queryKey: ["contractors"],
    queryFn: () => fetchData("/api/workers/worker-counts"),
  });

  const {
    data: workers,
    isLoading: workersLoading,
    isError: workersError,
  } = useQuery({
    queryKey: ["workers"],
    queryFn: () => fetchData("/api/workers"),
  });

  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
  } = useQuery({
    queryKey: ["projects", selectedCompany],
    queryFn: () => fetchData(`/api/projects/company/${selectedCompany}`),
    enabled: !!selectedCompany,
  });

  const {
    data: dailyReports = [],
    isLoading: dailyReportsLoading,
    isError: dailyReportsError,
  } = useQuery({
    queryKey: ["dailyReports"],
    queryFn: () => fetchData("/api/attendance"),
  });

  const {
    data: safetyReports = [],
    isLoading: safetyReportsLoading,
    isError: safetyReportsError,
  } = useQuery({
    queryKey: ["safetyReports"],
    queryFn: () => fetchData("/api/projects/safety-report"),
  });

  useEffect(() => {
    if (
      contractorsError ||
      workersError ||
      projectsError ||
      dailyReportsError ||
      safetyReportsError
    ) {
      toast.error("An error occurred while fetching data");
    }
  }, [
    contractorsError,
    workersError,
    projectsError,
    dailyReportsError,
    safetyReportsError,
  ]);

  if (
    contractorsLoading ||
    workersLoading ||
    projectsLoading ||
    dailyReportsLoading ||
    safetyReportsLoading
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (
    contractorsError ||
    workersError ||
    projectsError ||
    dailyReportsError ||
    safetyReportsError
  ) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl text-red-500 font-bold mb-2">Error</h2>
          <p>Failed to load dashboard data. Please try again later.</p>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const attendanceData = {
    labels: dailyReports.map((r) =>
      new Date(r.date).toLocaleDateString("en-US")
    ),
    datasets: [
      {
        label: "Daily Attendance",
        data: dailyReports.map((r) => r.attendance_count),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const workforceData = {
    labels: ["Saudi", "Non-Saudi"],
    datasets: [
      {
        label: "Worker Distribution",
        data: [
          contractors.reduce((t, c) => t + c.saudiWorkers, 0),
          contractors.reduce((t, c) => t + c.nonSaudiWorkers, 0),
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const jobTitlesData = {
    labels: [
      "WPR",
      "Supervisor",
      "Safety Officer",
      "Helper",
      "HVAC",
      "Elect",
      "PCST",
      "Welder",
      "Fabricator",
      "Metal",
      "Machinist",
    ],
    datasets: [
      {
        label: "Workers by Job Title",
        data: [
          contractors.reduce((t, c) => t + c.wprWorkers, 0),
          contractors.reduce((t, c) => t + c.supervisorWorkers, 0),
          contractors.reduce((t, c) => t + c.safetyOfficerWorkers, 0),
          contractors.reduce((t, c) => t + c.helperWorkers, 0),
          contractors.reduce((t, c) => t + c.hvacWorkers, 0),
          contractors.reduce((t, c) => t + c.electWorkers, 0),
          contractors.reduce((t, c) => t + c.pcstWorkers, 0),
          contractors.reduce((t, c) => t + c.welderWorkers, 0),
          contractors.reduce((t, c) => t + c.fabricatorWorkers, 0),
          contractors.reduce((t, c) => t + c.metalWorkers, 0),
          contractors.reduce((t, c) => t + c.machinistWorkers, 0),
        ],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const mergeSafetyData = (data) =>
    data.reduce((acc, curr) => {
      const found = acc.find((i) => i.contractorName === curr.contractorName);
      if (found) {
        Object.keys(curr).forEach((key) => {
          if (key !== "contractorName") found[key] += curr[key];
        });
      } else acc.push({ ...curr });
      return acc;
    }, []);

  const merged = mergeSafetyData(safetyReports);

  const safetyData = {
    labels: merged.map((r) => r.contractorName),
    datasets: [
      {
        label: "FAI",
        data: merged.map((r) => r.ytdFAI),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Observations",
        data: merged.map((r) => r.ytdObservation),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Incidents",
        data: merged.map((r) => r.ytdIncident),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "Near-miss",
        data: merged.map((r) => r.ytdIncident),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const totalWorkers = contractors.reduce(
    (sum, c) => sum + c.totalWorkers,
    0
  );
  const totalSaudiWorkers = contractors.reduce(
    (sum, c) => sum + c.saudiWorkers,
    0
  );
  const totalNonSaudiWorkers = contractors.reduce(
    (sum, c) => sum + c.nonSaudiWorkers,
    0
  );
  const saudiPercentage =
    totalWorkers > 0
      ? ((totalSaudiWorkers / totalWorkers) * 100).toFixed(1)
      : 0;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        Contractor Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard title="Total Workers" value={totalWorkers} color="text-blue-600" />
        <SummaryCard
          title="Saudi Workers"
          value={`${totalSaudiWorkers} (${saudiPercentage}%)`}
          color="text-green-600"
        />
        <SummaryCard title="Non-Saudi Workers" value={totalNonSaudiWorkers} color="text-purple-600" />
        <SummaryCard title="Total Contractors" value={contractors.length} color="text-orange-600" />
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <ChartWrapper title="Daily Attendance">
          <Line data={attendanceData} />
        </ChartWrapper>

        <ChartWrapper title="Worker Distribution">
          <Bar data={workforceData} />
        </ChartWrapper>

        <ChartWrapper title="Workers by Job Title">
          <Bar data={jobTitlesData} />
        </ChartWrapper>

        <ChartWrapper title="Safety Reports">
          <Bar data={safetyData} />
        </ChartWrapper>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, color }) => (
  <div className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-sm md:text-lg font-semibold text-gray-600 mb-1">{title}</h3>
    <p className={`text-xl md:text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const ChartWrapper = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-auto">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="w-full min-w-[300px]">{children}</div>
  </div>
);

export default ContractorDashboard;
