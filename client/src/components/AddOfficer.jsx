import React, { useState } from "react";
import { useSelector } from "react-redux";

const AddOfficer = ({ onAdd }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const companyId = currentUser._id;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const officer = {
        companyId: currentUser?.isComown ? currentUser._id : "",
        id,
        name,
        email,
        phoneNumber: phoneNumber || null,
        password,
      };
      const res = await fetch(`${apiUrl}/api/officer/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(officer),
      });
      const data = await res.json();

      if (res.ok) {
        setId("");
        setName("");
        setPhoneNumber("");
        setEmail("");
        setPassword("");
        onAdd();
      }
    } catch (error) {
      console.error("An error occurred while adding the officer:", error);
    }
  };

  return (
    <div className="flex justify-center items-start p-4 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full max-w-md">
        <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center">
          Add Officer
        </h3>

        {/* ID Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">ID:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Phone Number (optional):
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password:</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Add Officer
        </button>
      </form>
    </div>
  );
};

export default AddOfficer;