import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Sidebar from "../Sidebar/Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import MobileNavbar from "../Mobile Navbar/MobileNavbar";

const ProjectReport = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [salaryData, setSalaryData] = useState([]);
  const [billingData, setBillingData] = useState([]);

  const [grandTotal, setGrandTotal] = useState(0);
  const [totalSalary, setTotalSalary] = useState(0);

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔥 Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(data);
    };
    fetchProjects();
  }, []);

  // 🔥 Fetch Salary + Billing
  useEffect(() => {
    if (!selectedProject) {
      setSalaryData([]);
      setBillingData([]);
      setTotalSalary(0);
      setGrandTotal(0);
      return;
    }

    const fetchData = async () => {
      try {
        const projectObj = projects.find(p => p.id === selectedProject);
        const projectNameStr = projectObj ? projectObj.projectName : "";
        if (!projectNameStr) return;

        // Salary
        const salarySnapshot = await getDocs(
          query(
            collection(db, "salaryLogs"),
            where("projectName", "==", projectNameStr)
          )
        );

        const salaryList = salarySnapshot.docs.map(doc => doc.data());
        setSalaryData(salaryList);

        const salarySum = salaryList.reduce(
          (sum, item) => sum + Number(item.totalSalary || 0),
          0
        );
        setTotalSalary(salarySum);

        // Billing
        const billingSnapshot = await getDocs(
          query(
            collection(db, "invoicebilling"),
            where("selectedProject", "==", selectedProject)
          )
        );

        const billingList = billingSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBillingData(billingList);

        const total = billingList.reduce(
          (sum, item) => sum + Number(item.grandTotal || 0),
          0
        );

        setGrandTotal(total);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [selectedProject, projects]);

  const getProjectName = () => {
    const projectObj = projects.find(p => p.id === selectedProject);
    return projectObj ? projectObj.projectName : "All";
  };

  // 📄 PDF
  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Project Report", 14, 15);

    doc.setFontSize(12);
    doc.text(`Project: ${getProjectName()}`, 14, 25);
    doc.text(`Total Salary: Rs. ${totalSalary}`, 14, 35);
    doc.text(`Total Billing: Rs. ${grandTotal}`, 14, 42);
    doc.text(`Profit: Rs. ${grandTotal - totalSalary}`, 14, 49);

    autoTable(doc, {
      startY: 60,
      head: [["Employee", "Date", "Count", "Amount"]],
      body: salaryData.map(item => [
        item.employeeName,
        item.date ? new Date(item.date).toLocaleDateString("en-IN") : "",
        item.count || 0,
        item.totalSalary
      ])
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Invoice", "Date", "Amount"]],
      body: billingData.map(item => [
        item.invoiceNumber,
        item.invoiceDate,
        item.grandTotal
      ])
    });

    doc.save("Project_Report.pdf");
  };

  // 🎨 Styles
  const styles = {
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      background: "#fff",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    th: {
      background: "#4CAF50",
      color: "#fff",
      padding: isMobile ? "8px" : "12px",
      fontSize: isMobile ? "12px" : "14px"
    },
    td: {
      padding: isMobile ? "8px" : "12px",
      fontSize: isMobile ? "12px" : "14px",
      borderBottom: "1px solid #eee"
    }
  };

  const cardBox = {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  };

  return (
    <div>
      <MobileNavbar/>
    <div style={{ display: "flex", background: "#f1f5f9" }}>
       
      {/* SIDEBAR */}
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
   
      {/* MAIN */}
      <div
        style={{
          marginLeft: isMobile ? "0px" : (isOpen ? "220px" : "70px"),
          width: "100%",
          minHeight: "100vh",
          padding: isMobile ? "15px" : "30px 60px",
          transition: "0.3s"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "10px",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            marginBottom: "20px"
          }}
        >
          <h2>📊 Project Report</h2>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px" }}
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>

          <button
            onClick={downloadReport}
            style={{
              padding: "10px 15px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            📄 Download
          </button>
        </div>

        {/* CARDS */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            marginBottom: "20px"
          }}
        >
          <div style={cardBox}>
            <p>Total Salary</p>
            <h2>₹ {totalSalary.toFixed(2)}</h2>
          </div>

          <div style={cardBox}>
            <p>Total Billing</p>
            <h2>₹ {grandTotal.toFixed(2)}</h2>
          </div>

          <div style={cardBox}>
            <p>Profit</p>
            <h2 style={{ color: "green" }}>
              ₹ {(grandTotal - totalSalary).toFixed(2)}
            </h2>
          </div>
        </div>

        {/* SALARY TABLE */}
        <h3>Salary Details</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Count</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {salaryData.length > 0 ? (
                salaryData.map((item, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{item.employeeName}</td>
                    <td style={styles.td}>
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                    <td style={styles.td}>{item.count || 0}</td>
                    <td style={styles.td}>₹ {item.totalSalary}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={styles.td}>No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BILLING TABLE */}
        <h3>Billing Details</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {billingData.length > 0 ? (
                billingData.map(item => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.invoiceNumber}</td>
                    <td style={styles.td}>{item.invoiceDate}</td>
                    <td style={styles.td}>₹ {item.grandTotal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={styles.td}>No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProjectReport;