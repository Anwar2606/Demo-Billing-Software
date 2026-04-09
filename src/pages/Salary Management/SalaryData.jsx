// SalaryList.jsx

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../Sidebar/Sidebar";
import MobileNavbar from "../Mobile Navbar/MobileNavbar";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SalaryList = () => {
  const [salaryLogs, setSalaryLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Fetch Data
  const fetchSalaryLogs = async () => {
    const snapshot = await getDocs(collection(db, "salaryLogs"));
    setSalaryLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, "projects"));
    setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchSalaryLogs();
    fetchProjects();

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter
  const filteredLogs = selectedProject
    ? salaryLogs.filter(log => log.projectName === selectedProject)
    : salaryLogs;

  // Total
  const grandTotal = filteredLogs.reduce(
    (sum, log) => sum + Number(log.totalSalary || 0),
    0
  );

  // PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Salary Report", 14, 15);

    const rows = filteredLogs.map(log => [
      log.date,
      log.projectName,
      log.employeeName,
      log.count,
      `Rs.${log.perDaySalary}`,
      `Rs.${log.totalSalary}`,
    ]);

    autoTable(doc, {
      head: [["Date","Project","Employee","Workers","Per Day","Total"]],
      body: rows,
      startY: 20,
    });

    doc.text(`Grand Total: Rs.${grandTotal}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save("Salary_Report.pdf");
  };

  return (
    <div>
      <MobileNavbar />

      <div style={styles.layout}>
        <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

        <div
          style={{
            ...styles.main,
            marginLeft: isOpen && !isMobile ? "250px" : "0",
          }}
        >
          <div style={styles.container}>
            <h2 style={styles.heading}>📊 Salary Records</h2>

            {/* Filter */}
            <div style={styles.filterBox}>
              <select
                style={styles.input}
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">All Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={p.projectName}>
                    {p.projectName}
                  </option>
                ))}
              </select>

              <button style={styles.btn} onClick={handleDownloadPDF}>
                📥 Download PDF
              </button>
            </div>

            {/* Desktop Table */}
            {!isMobile && (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Project</th>
                      <th style={styles.th}>Employee</th>
                      <th style={styles.th}>Workers</th>
                      <th style={styles.th}>Per Day</th>
                      <th style={styles.th}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map(log => (
                      <tr key={log.id}>
                        <td style={styles.td}>{log.date}</td>
                        <td style={styles.td}>{log.projectName}</td>
                        <td style={styles.td}>{log.employeeName}</td>
                        <td style={styles.td}>{log.count}</td>
                        <td style={styles.td}>₹{log.perDaySalary}</td>
                        <td style={styles.td}>₹{log.totalSalary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile Cards */}
            {isMobile && (
              <div style={styles.cardWrap}>
                {filteredLogs.map(log => (
                  <div key={log.id} style={styles.card}>
                    <p><b>Date:</b> {log.date}</p>
                    <p><b>Project:</b> {log.projectName}</p>
                    <p><b>Employee:</b> {log.employeeName}</p>
                    <p><b>Workers:</b> {log.count}</p>
                    <p><b>Per Day:</b> ₹{log.perDaySalary}</p>
                    <p style={styles.cardTotal}>
                      Total: ₹{log.totalSalary}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div style={styles.total}>
              Grand Total: ₹{grandTotal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryList;

// STYLES
const styles = {
  layout: { display: "flex", background: "#f6f8fb" },
  main: { flex: 1, padding: "10px" },
  container: { maxWidth: "1100px", margin: "auto" },

  heading: {
    fontSize: "clamp(16px,2vw,22px)",
    marginBottom: "15px",
  },

  filterBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "15px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  btn: {
    padding: "10px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },

  tableWrapper: { overflowX: "auto" },

  table: {
    width: "100%",
    minWidth: "600px",
    borderCollapse: "collapse",
    background: "#fff",
  },

  th: {
    background: "#4caf50",
    color: "#fff",
    padding: "8px",
  },

  td: {
    padding: "8px",
    borderBottom: "1px solid #eee",
  },

  cardWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  card: {
    background: "#fff",
    padding: "12px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },

  cardTotal: {
    marginTop: "8px",
    fontWeight: "bold",
    color: "green",
  },

  total: {
    marginTop: "15px",
    padding: "12px",
    background: "#e8f5e9",
    textAlign: "right",
    fontWeight: "bold",
  },
};