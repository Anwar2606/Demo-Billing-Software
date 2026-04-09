import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MobileNavbar.css";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState(null);

  const [isBillOpen, setIsBillOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);

  useEffect(() => {
    const fetchLastInvoice = async () => {
      const q = query(
        collection(db, "invoicebilling"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snap = await getDocs(q);
      if (!snap.empty) {
        setLastInvoiceNumber(snap.docs[0].data().invoiceNumber);
      }
    };

    fetchLastInvoice();
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="mobile-navbar">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-nav-btn"
        >
          ☰ Menu
        </button>
      </div>

      {/* Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <ul>
            <li>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </li>

            <li>
              <Link to="/products" onClick={() => setIsOpen(false)}>
                Products
              </Link>
            </li>

            {/* 🔥 BILL MENU */}
            <li onClick={() => setIsBillOpen(!isBillOpen)}>
              Bill {isBillOpen ? "▲" : "▼"}
            </li>

            {isBillOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/invoicecopy" onClick={() => setIsOpen(false)}>
                    All Bill
                  </Link>
                </li>

                <li>
                  <Link to="/invoiceeditbill" onClick={() => setIsOpen(false)}>
                    Edit Bill
                  </Link>
                </li>

                <li>
                  <Link to="/invoicebill" onClick={() => setIsOpen(false)}>
                    Generate Bill
                  </Link>
                </li>
              </ul>
            )}

            {/* 🔥 PROJECT MENU */}
            <li onClick={() => setIsProjectOpen(!isProjectOpen)}>
              Project {isProjectOpen ? "▲" : "▼"}
            </li>

            {isProjectOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/addemployee" onClick={() => setIsOpen(false)}>
                    Add Employee
                  </Link>
                </li>

                <li>
                  <Link to="/salarymanagement" onClick={() => setIsOpen(false)}>
                    Salary Calculator
                  </Link>
                </li>

                <li>
                  <Link to="/projectreport" onClick={() => setIsOpen(false)}>
                    Project Report
                  </Link>
                </li>
              </ul>
            )}

            {/* LAST BILL */}
            <li>
              <Link to="/invoice" onClick={() => setIsOpen(false)}>
                Last Bill: {lastInvoiceNumber ?? "Loading..."}
              </Link>
            </li>

            <li>
              <Link to="/" onClick={() => setIsOpen(false)}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;