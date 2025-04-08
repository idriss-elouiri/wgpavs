"use client";

import React, { useState, useEffect } from "react";
import AddComown from "./AddComown";

const ComownManagementComp = () => {
  const [comowns, setComowns] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedComown, setSelectedComown] = useState(null);
  const [editCompanyId, setEditCompanyId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchComowns();
  }, []);

  const fetchComowns = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/authComown`);
      const data = await res.json();
      if (res.ok) {
        setComowns(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("An error occurred while fetching comown data:", error);
    }
  };

  const handleEditClick = (comown) => {
    setSelectedComown(comown);
    setEditCompanyId(comown.companyId);
    setEditName(comown.name);
    setEditEmail(comown.email);
    setEditPassword(comown.password);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (comown) => {
    setSelectedComown(comown);
    setShowDeletePopup(true);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Comown Management
      </h2>
      <div className="mb-6">
        <AddComown onAdd={fetchComowns} />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="border p-2 sm:p-3">Company ID</th>
              <th className="border p-2 sm:p-3">Name</th>
              <th className="border p-2 sm:p-3">Email</th>
              <th className="border p-2 sm:p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comowns.map((comown) => (
              <tr key={comown._id} className="hover:bg-gray-50">
                <td className="border p-2 sm:p-3">{comown.companyId}</td>
                <td className="border p-2 sm:p-3">{comown.name}</td>
                <td className="border p-2 sm:p-3">{comown.email}</td>
                <td className="border p-2 sm:p-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleEditClick(comown)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(comown)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
  );
};

export default ComownManagementComp;
