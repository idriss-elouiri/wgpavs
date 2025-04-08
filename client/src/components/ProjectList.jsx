"use client"

import React, { useEffect, useState } from "react";
import AddProject from "./AddProject";
import { useSelector } from "react-redux";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    project_number: "",
    start_date: "",
    end_date: "",
    status: "Active",
    location: "",
    assigned_location: "",
    company_id: "",
    contractor_id: "",
    notes: "",
    safetyType: "FAI",
    occurredOn: "",
    description: "",
    statusOfs: "open",
    schstartDate: "",
    schendDate: "",
    remarks: "",
    contractorWillWorkNextWeek: false,
  });
  const [contractors, setContractors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchProjects();
    fetchContractors();
    fetchCompanies();
  }, []);

  const fetchProjects = async () => {
    try {
      let url = `${apiUrl}/api/projects`;

      // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
      if (currentUser.isComown) {
        url = `${apiUrl}/api/projects/company/${currentUser._id}`;
      }

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchContractors = async () => {
    try {
      let url = `${apiUrl}/api/contractors`;

      // إذا كان المستخدم من نوع "شركة"، نضيف companyId إلى الـ URL
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

  const handleEditClick = (project) => {
    // Format dates for the form
    const formattedProject = {
      ...project,
      start_date: project.start_date ? formatDateForInput(project.start_date) : "",
      end_date: project.end_date ? formatDateForInput(project.end_date) : "",
      occurredOn: project.occurredOn ? formatDateForInput(project.occurredOn) : "",
      schstartDate: project.schstartDate ? formatDateForInput(project.schstartDate) : "",
      schendDate: project.schendDate ? formatDateForInput(project.schendDate) : "",
    };

    setSelectedProject(project);
    setEditFormData(formattedProject);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    setDeleteLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/projects/${projectToDelete._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (res.ok) {
        // Remove the deleted project from the local state
        setProjects(projects.filter(project => project._id !== projectToDelete._id));
        setShowDeleteConfirm(false);
        setProjectToDelete(null);
      } else {
        const data = await res.json();
        alert(data.message || "Error deleting project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper function to format dates for input fields
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/projects/${selectedProject._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();

      if (res.ok) {
        // Update the project in the local state to avoid refetching
        const updatedProjects = projects.map(project =>
          project._id === selectedProject._id ? { ...project, ...editFormData } : project
        );

        setProjects(updatedProjects);
        setShowEditPopup(false);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">إدارة المشاريع</h2>
      <AddProject onAdd={fetchProjects} />

      {/* Project List */}
      <div className="bg-white shadow-lg rounded-lg p-3 sm:p-6 overflow-x-auto mt-4 sm:mt-8">
        {isLoading ? (
          <div className="text-center py-4">جاري التحميل...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-4">لا توجد مشاريع متاحة</div>
        ) : (
          <>
            {/* Desktop view (hidden on small screens) */}
            <div className="hidden md:block">
              <table className="w-full border-collapse border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left text-sm">Company Name</th>
                    <th className="border p-2 text-left text-sm">Project Name</th>
                    <th className="border p-2 text-left text-sm">Project Number</th>
                    <th className="border p-2 text-left text-sm">Start Date</th>
                    <th className="border p-2 text-left text-sm">End Date</th>
                    <th className="border p-2 text-left text-sm">Status</th>
                    <th className="border p-2 text-left text-sm">Location</th>
                    {currentUser?.isContractor && (
                      <>
                        <th className="border p-2 text-left text-sm">Scheduled Start</th>
                        <th className="border p-2 text-left text-sm">Scheduled End</th>
                        <th className="border p-2 text-left text-sm">Remarks</th>
                        <th className="border p-2 text-left text-sm">Will Work Next Week</th>
                      </>
                    )}
                    <th className="border p-2 text-left text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id} className="hover:bg-gray-50">
                      <td className="border p-2 text-sm">{project.company_id?.name || "N/A"}</td>
                      <td className="border p-2 text-sm">{project.name}</td>
                      <td className="border p-2 text-sm">{project.project_number}</td>
                      <td className="border p-2 text-sm">{formatDate(project.start_date)}</td>
                      <td className="border p-2 text-sm">{formatDate(project.end_date)}</td>
                      <td className="border p-2 text-sm">
                        <span className={`px-2 py-1 rounded text-white ${project.status === 'Active' ? 'bg-green-500' :
                          project.status === 'Expired' ? 'bg-red-500' : 'bg-blue-500'
                          }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="border p-2 text-sm">{project.location}</td>
                      {currentUser?.isContractor && (
                        <>
                          <td className="border p-2 text-sm">{formatDate(project.schstartDate)}</td>
                          <td className="border p-2 text-sm">{formatDate(project.schendDate)}</td>
                          <td className="border p-2 text-sm">{project.remarks}</td>
                          <td className="border p-2 text-sm">{project.contractorWillWorkNextWeek ? "نعم" : "لا"}</td>
                        </>
                      )}
                      <td className="border p-2 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(project)}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-xs sm:text-sm"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteClick(project)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-xs sm:text-sm"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view (visible only on small screens) */}
            <div className="md:hidden">
              {projects.map((project) => (
                <div key={project._id} className="border rounded-lg mb-4 overflow-hidden shadow-sm">
                  <div className="bg-gray-50 p-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-xs text-gray-600">{project.project_number}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      project.status === 'Active' ? 'bg-green-500' :
                      project.status === 'Expired' ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-xs font-semibold">Company:</p>
                        <p className="text-xs">{project.company_id?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Location:</p>
                        <p className="text-xs">{project.location}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Start Date:</p>
                        <p className="text-xs">{formatDate(project.start_date)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold">End Date:</p>
                        <p className="text-xs">{formatDate(project.end_date)}</p>
                      </div>
                      
                      {currentUser?.isContractor && (
                        <>
                          <div>
                            <p className="text-xs font-semibold">Scheduled Start:</p>
                            <p className="text-xs">{formatDate(project.schstartDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold">Scheduled End:</p>
                            <p className="text-xs">{formatDate(project.schendDate)}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs font-semibold">Will Work Next Week:</p>
                            <p className="text-xs">{project.contractorWillWorkNextWeek ? "نعم" : "لا"}</p>
                          </div>
                          {project.remarks && (
                            <div className="col-span-2">
                              <p className="text-xs font-semibold">Remarks:</p>
                              <p className="text-xs">{project.remarks}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleEditClick(project)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs flex-1"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteClick(project)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs flex-1"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
              تعديل المشروع
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleChange}
                    placeholder="Project Name"
                    className="block w-full p-2 border border-gray-300 rounded text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Project Number</label>
                  <input
                    type="text"
                    name="project_number"
                    value={editFormData.project_number}
                    onChange={handleChange}
                    placeholder="Project Number"
                    className="block w-full p-2 border border-gray-300 rounded text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Location</label>
                  <select
                    name="location"
                    value={editFormData.location}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">location</option>
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
                  <label className="block text-gray-700 mb-1 text-sm">End-User</label>
                  <select
                    name="assigned_location"
                    value={editFormData.assigned_location}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">End-User</option>
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
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={editFormData.start_date}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={editFormData.end_date}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Status</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Company</label>
                  <select
                    name="company_id"
                    value={editFormData.company_id}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded text-sm"
                    required
                  >
                    <option value={""}>Select Company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">Contractor</label>
                  <select
                    name="contractor_id"
                    value={editFormData.contractor_id}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded text-sm"
                    required
                  >
                    <option value="">
                      {currentUser.isContractor ? currentUser.name : "Select Contractor"}
                    </option>
                    {contractors.map((contractor) => (
                      <option key={contractor._id} value={contractor._id}>
                        {contractor.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1 text-sm">Notes</label>
                <textarea
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleChange}
                  placeholder="Notes (Optional)"
                  className="block w-full p-2 border border-gray-300 rounded text-sm"
                  rows="3"
                />
              </div>

              {currentUser?.isOfficer && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3 text-sm">Safety Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm">Safety Type</label>
                      <select
                        name="safetyType"
                        value={editFormData.safetyType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-sm"
                      >
                        <option value="FAI">FAI</option>
                        <option value="NEAR-MISS">NEAR-MISS</option>
                        <option value="Observation">Observation</option>
                        <option value="Incident">Incident</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm">Occurred On</label>
                      <input
                        type="date"
                        name="occurredOn"
                        value={editFormData.occurredOn}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-1 text-sm">Description</label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-sm"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm">Status</label>
                      <select
                        name="statusOfs"
                        value={editFormData.statusOfs}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-sm"
                      >
                        <option value="open">open</option>
                        <option value="closed">closed</option>
                        <option value="under-investigation">under-investigation</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentUser?.isContractor && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3 text-sm">Contractor Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm">Scheduled Start Date</label>
                      <input
                        type="date"
                        name="schstartDate"
                        value={editFormData.schstartDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm">Scheduled End Date</label>
                      <input
                        type="date"
                        name="schendDate"
                        value={editFormData.schendDate}
                        onChange={handleChange}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-1 text-sm">Remarks</label>
                      <textarea
                        name="remarks"
                        value={editFormData.remarks}
                        onChange={handleChange}
                        placeholder="Remarks"
                        className="w-full p-2 border rounded text-sm"
                        rows="3"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">Will Work Next Week</label>
                    <select
                      name="contractorWillWorkNextWeek"
                      value={editFormData.contractorWillWorkNextWeek}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, contractorWillWorkNextWeek: e.target.value === "true" })
                      }
                      className="block w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="true">نعم</option>
                      <option value="false">لا</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition text-sm"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">تأكيد الحذف</h3>
            <p className="mb-6 text-center">
              هل أنت متأكد من رغبتك في حذف المشروع "{projectToDelete?.name}"؟
              <br />
              <span className="text-red-500 text-sm">هذا الإجراء لا يمكن التراجع عنه.</span>
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                disabled={deleteLoading}
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                disabled={deleteLoading}
              >
                {deleteLoading ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;