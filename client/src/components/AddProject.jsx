import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AddProject = ({ onAdd }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [contractors, setContractors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const contractor_id = currentUser?.isContractor ? currentUser._id : "";

  const [formData, setFormData] = useState({
    name: "",
    project_number: "",
    start_date: "",
    end_date: "",
    status: "Active",
    location: "",
    assigned_location: "",
    company_id: "",
    contractor_id: contractor_id,
    notes: "",
    safetyType: "FAI",
    occurredOn: "",
    description: "",
    statusOfs: "open",
    schstartDate: "",
    schendDate: "",
    remarks: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchContractors();
    fetchCompanies();
  }, []);

  const fetchContractors = async () => {
    try {
      let url = `${apiUrl}/api/contractors`;
      if (currentUser.isComown) {
        url = `${apiUrl}/api/contractors/${currentUser._id}`;
      }
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setContractors(data);
    } catch (error) {
      console.error("Error fetching contractors:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/authComown`);
      const data = await res.json();
      if (res.ok) setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/projects/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, companyId: currentUser?.isComown ? currentUser._id : ""
        }),
      });
      const data = await res.json();
      if (res.ok) onAdd();
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex justify-center items-start p-4 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">
          Add New Project
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Project Info Column 1 */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Project Number:</label>
              <input
                type="text"
                name="project_number"
                value={formData.project_number}
                onChange={handleChange}
                placeholder="Project Number"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Project Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Project Name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Location:</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Select Location</option>
                <option value="NGL">NGL</option>
                <option value="Flare-Area">Flare Area</option>
                <option value="SRU-HU">SRU-HU</option>
                <option value="FG">FG</option>
                <option value="UT">UT</option>
                <option value="Cogen">Cogen</option>
                <option value="Off-Site">Off Site</option>
                <option value="Sulfur-Loading">Sulfur Loading</option>
                <option value="Handlling">Handlling</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">End-User:</label>
              <select
                name="assigned_location"
                value={formData.assigned_location}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Select End-User</option>
                <option value="NGL">NGL</option>
                <option value="Degital">Degital</option>
                <option value="GT">GT</option>
                <option value="SRU">SRU</option>
                <option value="FG">FG</option>
                <option value="UT">UT</option>
                <option value="Elect">Elect</option>
                <option value="PSCT">PSCT</option>
                <option value="CU">CU</option>
                <option value="T&l">T&l</option>
                <option value="Multi-Craft">Multi Craft</option>
                <option value="PZV">PZV</option>
                <option value="HVAC">HVAC</option>
              </select>
            </div>
          </div>

          {/* Project Info Column 2 */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Start Date:</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">End Date:</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Company:</label>
              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                required
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contractor (full width) */}
        {!currentUser?.isContractor && (
          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Contractor:</label>
            <select
              name="contractor_id"
              value={formData.contractor_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            >
              <option value="">Select Contractor</option>
              {contractors.map((contractor) => (
                <option key={contractor._id} value={contractor._id}>
                  {contractor.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notes (full width) */}
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes (Optional)"
            rows="3"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Officer-specific fields */}
        {currentUser?.isOfficer && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="md:col-span-2">
              <h4 className="text-lg font-medium mb-3 border-b pb-2">Safety Information</h4>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Safety Type:</label>
              <select
                value={formData.safetyType}
                onChange={(e) => setFormData({ ...formData, safetyType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="FAI">FAI</option>
                <option value="NEAR-MISS">NEAR-MISS</option>
                <option value="Observation">Observation</option>
                <option value="Incident">Incident</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Occurred On:</label>
              <input
                type="date"
                value={formData.occurredOn}
                onChange={(e) => setFormData({ ...formData, occurredOn: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Status:</label>
              <select
                value={formData.statusOfs}
                onChange={(e) => setFormData({ ...formData, statusOfs: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="open">open</option>
                <option value="closed">closed</option>
                <option value="under-investigation">under-investigation</option>
              </select>
            </div>
          </div>
        )}

        {/* Contractor-specific fields */}
        {currentUser?.isContractor && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="md:col-span-2">
              <h4 className="text-lg font-medium mb-3 border-b pb-2">Contractor Information</h4>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Scheduled Start Date:</label>
              <input
                type="date"
                name="schstartDate"
                value={formData.schstartDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Scheduled End Date:</label>
              <input
                type="date"
                name="schendDate"
                value={formData.schendDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Remarks:</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Remarks"
                rows="3"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;