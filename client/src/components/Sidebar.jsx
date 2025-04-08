import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  FaTachometerAlt,
  FaUserTie,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaUsers,
  FaClipboardCheck,
  FaTimes,
  FaBuilding,
  FaPlus,
  FaChartLine,
  FaCog,
  FaHardHat,
  FaBars,
} from "react-icons/fa";

const Sidebar = ({ showNav, onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isOwnerAd = currentUser?.isComown;
  const isContractor = currentUser?.isContractor;
  const isOfficer = currentUser?.isOfficer;

  return (
    <>
      {/* Mobile Menu Button (shown only on small screens) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 bg-indigo-600 text-white p-2 rounded-md shadow-lg"
        onClick={() => onClose(!showNav)}
        aria-label="Toggle Menu"
      >
        {showNav ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        className={`fixed lg:sticky top-0 z-30 ${showNav ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transform transition-transform duration-300 ease-in-out bg-indigo-600 text-white min-h-screen w-64 md:w-72 p-4 shadow-lg`}
      >
        {/* Close Button for Small Screens */}
        <button
          className="lg:hidden text-white text-2xl mb-4 focus:outline-none hover:text-indigo-300 transition-colors"
          onClick={() => onClose(false)}
          aria-label="Close Sidebar"
        >
          <FaTimes />
        </button>

        {/* Logo and System Name */}
        <div className="flex items-center mb-8 gap-2">
          <FaBuilding className="text-2xl" />
          <h2 className="text-xl font-semibold">System</h2>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {/* Main Menu */}
          {isOwnerAd && (
            <Link
              href="/dashboardOwn"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaTachometerAlt className="mr-3 text-lg" />
                <span>Dashboard Owner</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/dashboardAdm"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaTachometerAlt className="mr-3 text-lg" />
                <span>Dashboard Admin</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}
          {isContractor && (
            <Link
              href="/dashboardCont"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaTachometerAlt className="mr-3 text-lg" />
                <span>Dashboard Contractor</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}
          {isOfficer && (
            <Link
              href="/dashboardOfficer"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaTachometerAlt className="mr-3 text-lg" />
                <span>Dashboard Officer</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/ComownManagement"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaUserTie className="mr-3 text-lg" />
                <span>Owner Management</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}

          {(isAdmin || isOwnerAd) && (
            <Link
              href="/ContractorManagement"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaUserTie className="mr-3 text-lg" />
                <span>Contractor Management</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}

          {(isAdmin || isOwnerAd || isContractor || isOfficer) && (
            <Link
              href="/projectsPage"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaProjectDiagram className="mr-3 text-lg" />
                <span>Projects</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}

          {(isAdmin || isOwnerAd || isContractor) && (
            <Link
              href="/PaymentsPage"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaMoneyBillWave className="mr-3 text-lg" />
                <span>Payments</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}

          {(isAdmin || isOwnerAd || isContractor) && (
            <Link
              href="/workers"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaUsers className="mr-3 text-lg" />
                <span>Workers</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}

          {(isAdmin || isOwnerAd || isContractor) && (
            <Link
              href="/attendance"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaClipboardCheck className="mr-3 text-lg" />
                <span>Attendance</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}
          
          {(isAdmin || isOwnerAd || isContractor) && (
            <Link
              href="/officerSft"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaHardHat className="mr-3 text-lg" />
                <span>Safety Officer</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}
          
          {(isAdmin || isOwnerAd || isContractor) && (
            <Link
              href="/reports"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaChartLine className="mr-3 text-lg" />
                <span>Report</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}

          {(isAdmin || isOwnerAd) && (
            <Link
              href="/settings"
              className="flex items-center justify-between gap-3 p-3 rounded hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
              onClick={() => window.innerWidth < 1024 && onClose(false)}
            >
              <div className="flex items-center">
                <FaCog className="mr-3 text-lg" />
                <span>Settings</span>
              </div>
              <FaPlus className="text-xs md:text-sm" />
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;