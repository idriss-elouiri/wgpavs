"use client";

import React, { useState, useEffect } from "react";
import AddOfficer from "./AddOfficer";
import { useSelector } from "react-redux";

const OfficerManagementComp = () => {
  const [officers, setOfficers] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const companyId = currentUser._id;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      let url = `${apiUrl}/api/officer`;
      if (currentUser.isComown) {
        url = `${apiUrl}/api/officer/${companyId}`;
      }
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setOfficers(data);
      }
    } catch (error) {
      console.error("An error occurred while fetching officer data:", error);
    }
  };

  const handleEditClick = (officer) => {
    setSelectedOfficer(officer);
    setEditId(officer.id);
    setEditName(officer.name);
    setEditPhoneNumber(officer.phoneNumber || "");
    setEditEmail(officer.email);
    setEditPassword(officer.password);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (officer) => {
    setSelectedOfficer(officer);
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
      };
      const res = await fetch(`${apiUrl}/api/officer/${selectedOfficer._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowEditPopup(false);
        setSelectedOfficer(null);
        fetchOfficers();
      }
    } catch (error) {
      console.error("An error occurred while updating officer data:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/officer/${selectedOfficer._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setShowDeletePopup(false);
        setSelectedOfficer(null);
        fetchOfficers();
      }
    } catch (error) {
      console.error("An error occurred while deleting officer data:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Officer Management
      </h2>
      <div className="mb-6">
        <AddOfficer onAdd={fetchOfficers} />
      </div>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Mobile</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((officer) => (
              <tr key={officer._id} className="hover:bg-gray-50">
                <td className="border p-3">{officer.id}</td>
                <td className="border p-3">{officer.name}</td>
                <td className="border p-3">{officer.phoneNumber || "N/A"}</td>
                <td className="border p-3">{officer.email}</td>
                <td className="border p-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleEditClick(officer)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(officer)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

      {/* Edit Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Edit Officer
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              {[
                { label: "ID", value: editId, setter: setEditId },
                { label: "Name", value: editName, setter: setEditName },
                { label: "Email", value: editEmail, setter: setEditEmail },
                { label: "Phone Number", value: editPhoneNumber, setter: setEditPhoneNumber },
                { label: "Password", value: editPassword, setter: setEditPassword, type: "password" }
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}:
                  </label>
                  <input
                    type={field.type || "text"}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    required={field.label !== "Phone Number"}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Confirm Delete
            </h3>
            <p className="mb-6 text-center">
              Are you sure you want to delete officer{" "}
              <span className="font-bold">{selectedOfficer?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerManagementComp;
