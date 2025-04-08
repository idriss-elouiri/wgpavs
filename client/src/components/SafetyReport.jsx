import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SafetyReport = () => {
  const [safetyData, setSafetyData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchSafetyData();
  }, []);

  const fetchSafetyData = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/projects/safety-report`);
      const data = await res.json();
      if (res.ok) {
        // دمج الصفوف التي تحمل نفس اسم المقاول
        const mergedData = mergeContractorData(data);
        setSafetyData(mergedData);
      }
    } catch (error) {
      console.error("Error fetching safety data:", error);
    }
  };

  // دالة لدمج الصفوف التي تحمل نفس اسم المقاول
  const mergeContractorData = (data) => {
    return data.reduce((acc, curr) => {
      const existingContractor = acc.find(
        (item) => item.contractorName === curr.contractorName
      );

      if (existingContractor) {
        // إذا كان المقاول موجودًا بالفعل، نقوم بجمع القيم
        existingContractor.ytdFAI += curr.ytdFAI;
        existingContractor.ofFAINotCompleted += curr.ofFAINotCompleted;
        existingContractor.ytdObservation += curr.ytdObservation;
        existingContractor.ofObservationNotCompleted += curr.ofObservationNotCompleted;
        existingContractor.ytdIncident += curr.ytdIncident;
        existingContractor.ofIncidentNotCompleted += curr.ofIncidentNotCompleted;
        existingContractor.totalNotClosed += curr.totalNotClosed;
      } else {
        // إذا كان المقاول غير موجود، نضيفه إلى المصفوفة
        acc.push({ ...curr });
      }

      return acc;
    }, []);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Safety Report</h2>
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 overflow-x-auto">
        <div className="min-w-full md:min-w-0">
          {/* Desktop Table */}
          <table className="w-full border-collapse border border-gray-200 hidden md:table">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 md:p-3 text-left">Contractor Name</th>
                <th className="border p-2 md:p-3 text-left">YTD FAI</th>
                <th className="border p-2 md:p-3 text-left">OF FAI Not Completed</th>
                <th className="border p-2 md:p-3 text-left">YTD Observation</th>
                <th className="border p-2 md:p-3 text-left">OF Observation Not Completed</th>
                <th className="border p-2 md:p-3 text-left">YTD Incident</th>
                <th className="border p-2 md:p-3 text-left">OF Incident Not Completed</th>
                <th className="border p-2 md:p-3 text-left">Total Not Closed</th>
              </tr>
            </thead>
            <tbody>
              {safetyData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2 md:p-3">{data.contractorName}</td>
                  <td className="border p-2 md:p-3">{data.ytdFAI}</td>
                  <td className="border p-2 md:p-3">{data.ofFAINotCompleted}</td>
                  <td className="border p-2 md:p-3">{data.ytdObservation}</td>
                  <td className="border p-2 md:p-3">{data.ofObservationNotCompleted}</td>
                  <td className="border p-2 md:p-3">{data.ytdIncident}</td>
                  <td className="border p-2 md:p-3">{data.ofIncidentNotCompleted}</td>
                  <td className="border p-2 md:p-3">{data.totalNotClosed}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {safetyData.map((data, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-lg mb-2">{data.contractorName}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">YTD FAI</p>
                    <p>{data.ytdFAI}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">OF FAI Not Completed</p>
                    <p>{data.ofFAINotCompleted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">YTD Observation</p>
                    <p>{data.ytdObservation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">OF Observation Not Completed</p>
                    <p>{data.ofObservationNotCompleted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">YTD Incident</p>
                    <p>{data.ytdIncident}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">OF Incident Not Completed</p>
                    <p>{data.ofIncidentNotCompleted}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Total Not Closed</p>
                    <p className="font-semibold">{data.totalNotClosed}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyReport;