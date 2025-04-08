import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AddPayment = ({ onAdd }) => {
  const [amount, setAmount] = useState("");
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [paymentDate, setPaymentDate] = useState("");
  const [contractorId, setContractorId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const contractor_Id = currentUser?.isContractor ? currentUser._id : "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (projectId) {
      const fetchContractors = async () => {
        try {
          let url = `${apiUrl}/api/payments?project_id=${projectId}`;
          if (currentUser.isComown) {
            url = `${apiUrl}/api/payments/${currentUser._id}?project_id=${projectId}`;
          }
          const res = await fetch(url, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            const total = data.reduce((sum, payment) => sum + payment.amount, 0);
            setTotalAmount(total);
          }
        } catch (error) {
          console.error("Error fetching payments:", error);
        }
      };
      fetchContractors();
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjects();
    fetchContractors();
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
      if (res.ok) {
        setContractors(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("Error fetching contractors:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      let url = `${apiUrl}/api/projects`;
      if (currentUser.isComown) {
        url = `${apiUrl}/api/projects/company/${currentUser._id}`;
      }
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !paymentDate || !projectId || !remarks) {
      alert("Please fill in all fields");
      return;
    }
    if (amount > 100) {
      alert("The value must not exceed 100%");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/payments/${currentUser._id}?project_id=${projectId}`);
      const data = await res.json();
      const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0);
      if (totalAmount + amount > 100) {
        alert("Total payment amount cannot exceed 100%");
        return;
      }
    } catch (error) {
      console.error("Error validating payment:", error);
      alert("An error occurred while validating the payment amount");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: currentUser?.isComown ? currentUser._id : "",
          amount: parseFloat(amount),
          payment_status: paymentStatus,
          payment_date: paymentDate,
          project_id: projectId,
          contractor_id: currentUser?.isContractor ? contractor_Id : contractorId,
          remarks,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onAdd();
        setAmount("");
        setPaymentStatus("Unpaid");
        setPaymentDate("");
        setProjectId("");
        setRemarks("");
        alert("Payment added successfully!");
      } else {
        alert(data.message || "Error adding payment");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleProjectChange = (e) => {
    setProjectId(e.target.value);
  };

  return (
    <div className="flex justify-center items-start p-4 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">
          Add New Payment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Project selection */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Project:</label>
            <select
              value={projectId}
              onChange={handleProjectChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Contractor selection (hidden for contractors) */}
          {!currentUser?.isContractor && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Contractor:</label>
              <select
                value={contractorId}
                onChange={(e) => setContractorId(e.target.value)}
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

          {/* Total amount */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Total Amount:</label>
            <input
              type="text"
              value={`${totalAmount}%`}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>

          {/* Amount input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Amount (%):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter percentage"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              min="0"
              max={100 - totalAmount}
              required
            />
          </div>

          {/* Payment status */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Payment Status:</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            >
              <option value="Paid">Paid</option>
              <option value="Submitted">Submitted</option>
              <option value="Under-approval">Under-approval</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Payment date */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Payment Date:</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
        </div>

        {/* Remarks (full width) */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Remarks:</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Add Payment
        </button>
      </form>
    </div>
  );
};

export default AddPayment;