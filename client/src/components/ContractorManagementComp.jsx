import React, { useState, useEffect } from "react";
import AddContractor from "./AddContractor";
import { useSelector } from "react-redux";

const ContractorManagementComp = () => {
  const [contractors, setContractors] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editIktva, setEditIktva] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { currentUser } = useSelector((state) => state.user);
  const companyId = currentUser._id;

  useEffect(() => {
    fetchContractors();
  }, [companyId]);

  const fetchContractors = async () => {
    try {
      let url = `${apiUrl}/api/contractors`;

      if (currentUser.isComown) {
        url = `${apiUrl}/api/contractors/${companyId}`;
      }

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setContractors(data);
      }
    } catch (error) {
      console.error("An error occurred while fetching contractor data:", error);
    }
  };

  const handleEditClick = (contractor) => {
    setSelectedContractor(contractor);
    setEditId(contractor.id);
    setEditName(contractor.name);
    setEditPhoneNumber(contractor.phoneNumber || "");
    setEditEmail(contractor.email);
    setEditPassword(contractor.password);
    setEditStartDate(contractor.start_date);
    setEditEndDate(contractor.end_date);
    setEditAmount(contractor.amount);
    setEditIktva(contractor.Iktva);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (contractor) => {
    setSelectedContractor(contractor);
    setShowDeletePopup(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        id: editId,
        name: editName,
        email: editEmail,
        phoneNumber: editPhoneNumber,
        password: editPassword,
        start_date: editStartDate,
        end_date: editEndDate,
        amount: editAmount,
        Iktva: editIktva,
      };
      const res = await fetch(
        `${apiUrl}/api/contractors/${selectedContractor._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setShowEditPopup(false);
        setSelectedContractor(null);
        fetchContractors();
      }
    } catch (error) {
      console.error("An error occurred while updating contractor data:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/contractors/${selectedContractor._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setShowDeletePopup(false);
        setSelectedContractor(null);
        fetchContractors();
      }
    } catch (error) {
      console.error("An error occurred while deleting contractor data:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
        Contractor Management
      </h2>
      
      <div className="mb-6 md:mb-8">
        <AddContractor onAdd={fetchContractors} />
      </div>
      
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 overflow-x-auto">
        <div className="min-w-full overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 md:p-3 text-left text-xs md:text-sm">ID</th>
                <th className="p-2 md:p-3 text-left text-xs md:text-sm">Name</th>
                <th className="p-2 md:p-3 text-left text-xs md:text-sm hidden sm:table-cell">Mobile</th>
                <th className="p-2 md:p-3 text-left text-xs md:text-sm hidden md:table-cell">Email</th>
                <th className="p-2 md:p-3 text-left text-xs md:text-sm hidden lg:table-cell">Cybersecurity Cert</th>
                <th className="p-2 md:p-3 text-left text-xs md:text-sm hidden lg:table-cell">Pre-Qualification</th>
                <th className="p-2 md:p-3 text-left text-xs md:text-sm hidden md:table-cell">Saudization</th>
                <th className="p-2 md:p-3 text-left text-xs md:text-sm hidden sm:table-cell">Iktva</th>
                <th className="p-2 md:p-3 text-left text-xs md:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(contractors) &&
                contractors.map((contractor) => (
                  <tr key={contractor._id} className="hover:bg-gray-50 border-b">
                    <td className="p-2 md:p-3 text-xs md:text-sm">{contractor.id}</td>
                    <td className="p-2 md:p-3 text-xs md:text-sm font-medium">{contractor.name}</td>
                    <td className="p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                      {contractor.phoneNumber || "N/A"}
                    </td>
                    <td className="p-2 md:p-3 text-xs md:text-sm hidden md:table-cell truncate max-w-xs">
                      {contractor.email}
                    </td>
                    <td className="p-2 md:p-3 text-xs md:text-sm hidden lg:table-cell">
                      {new Date(contractor.start_date).toLocaleDateString()}
                    </td>
                    <td className="p-2 md:p-3 text-xs md:text-sm hidden lg:table-cell">
                      {new Date(contractor.end_date).toLocaleDateString()}
                    </td>
                    <td className="p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                      {contractor.amount}%
                    </td>
                    <td className="p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                      {contractor.Iktva}%
                    </td>
                    <td className="p-2 md:p-3 text-xs md:text-sm">
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                        <button
                          onClick={() => handleEditClick(contractor)}
                          className="bg-blue-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded hover:bg-blue-600 transition text-xs md:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(contractor)}
                          className="bg-red-500 text-white px-2 py-1 md:px-3 md:py-1.5 rounded hover:bg-red-600 transition text-xs md:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center">
              Edit Contractor
            </h3>
            <form onSubmit={handleUpdate} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-gray-700 text-sm md:text-base">ID:</label>
                <input
                  type="text"
                  value={editId}
                  onChange={(e) => setEditId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm md:text-base">Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm md:text-base">Email:</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm md:text-base">Phone:</label>
                <input
                  type="text"
                  value={editPhoneNumber}
                  onChange={(e) => setEditPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm md:text-base">Password:</label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm md:text-base">Start Date:</label>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm md:text-base">End Date:</label>
                <input
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm md:text-base">Saudization:</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm md:text-base">Iktva:</label>
                <input
                  type="number"
                  value={editIktva}
                  onChange={(e) => setEditIktva(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 text-sm md:text-base"
                />
              </div>
              <div className="flex justify-end space-x-2 md:space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="bg-gray-300 text-gray-700 px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-gray-400 transition text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-green-600 transition text-sm md:text-base"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 md:p-6 w-full max-w-md">
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-center">
              Confirm Delete
            </h3>
            <p className="mb-4 md:mb-6 text-center text-sm md:text-base">
              Are you sure you want to delete the contractor:{" "}
              <span className="font-bold">{selectedContractor?.name}</span>?
            </p>
            <div className="flex justify-end space-x-2 md:space-x-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 text-gray-700 px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-gray-400 transition text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded hover:bg-red-600 transition text-sm md:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorManagementComp;