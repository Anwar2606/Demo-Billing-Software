import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import Sidebar from "../Sidebar/Sidebar";
import MobileNavbar from "../Mobile Navbar/MobileNavbar";

const SalaryManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [count, setCount] = useState(1);
  const [perDaySalary, setPerDaySalary] = useState("");
  const [totalSalary, setTotalSalary] = useState(0);

  // ✅ Mobile resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Auto close sidebar in mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // 🔹 Fetch Employees
  const fetchEmployees = async () => {
    const querySnapshot = await getDocs(collection(db, "employees"));
    const empList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEmployees(empList);
  };

  // 🔹 Fetch Projects
  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(projectList);
  };

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
  }, []);

  // 🔹 Auto Calculate
  useEffect(() => {
    if (count && perDaySalary) {
      setTotalSalary(count * perDaySalary);
    } else {
      setTotalSalary(0);
    }
  }, [count, perDaySalary]);

  // 🔹 Save Salary
  const handleSaveSalary = async () => {
    if (!selectedEmployee || !selectedProject) {
      alert("Select all fields");
      return;
    }

    if (!count || !perDaySalary) {
      alert("Enter all fields");
      return;
    }

    await addDoc(collection(db, "salaryLogs"), {
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      projectName: selectedProject,
      count,
      perDaySalary: Number(perDaySalary),
      totalSalary,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
    });

    alert("Salary Saved ✅");

    setCount(1);
    setPerDaySalary("");
    setSelectedEmployee(null);
    setSelectedProject("");
    setTotalSalary(0);
  };

  return (
    <div>   
      <MobileNavbar/>
       <div style={{ display: "flex", background: "#f4f6f9" }}>

      {/* 🔥 Sidebar */}
      {(isOpen || !isMobile) && (
        <div
          style={{
            position: isMobile ? "fixed" : "relative",
            top: 0,
            left: 0,
            height: "100%",
            width: isMobile ? "220px" : "auto",
            zIndex: 1000,
            background: "#fff",
          }}
        >
          <Sidebar
            isOpen={isOpen}
            toggleSidebar={() => setIsOpen(!isOpen)}
          />
        </div>
      )}

      {/* 🔥 Overlay */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            zIndex: 999,
          }}
        />
      )}

      {/* 🔥 Main */}
      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? "0px" : (isOpen ? "250px" : "80px"),
          padding: isMobile ? "15px" : "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: isMobile ? "flex-start" : "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ width: "100%", maxWidth: "500px" }}>
          
          <h2 style={styles.heading}>Salary Entry</h2>

          <div style={styles.card(isMobile)}>

            {/* Project */}
            <label style={styles.label}>Project</label>
            <select
              style={styles.input}
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.projectName}>
                  {proj.projectName}
                </option>
              ))}
            </select>

            {/* Employee */}
            <label style={styles.label}>Employee</label>
            <select
              style={styles.input}
              value={selectedEmployee?.id || ""}
              onChange={(e) => {
                const emp = employees.find(
                  (emp) => emp.id === e.target.value
                );
                setSelectedEmployee(emp);
              }}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>

            {/* Count */}
            <label style={styles.label}>Number of Workers</label>
            <input
              style={styles.input}
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />

            {/* Salary */}
            <label style={styles.label}>Per Day Salary (₹)</label>
            <input
              style={styles.input}
              type="number"
              value={perDaySalary}
              onChange={(e) => setPerDaySalary(e.target.value)}
            />

            {/* Total */}
            <div style={styles.totalBox}>
              Total: ₹{totalSalary}
            </div>

            <button style={styles.saveBtn} onClick={handleSaveSalary}>
              💾 Save Salary
            </button>

          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SalaryManagement;

// 🎨 Styles
const styles = {
  heading: {
    marginBottom: "25px",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
  },

  card: (isMobile) => ({
    width: "90%",
    padding: isMobile ? "20px" : "35px",
    borderRadius: "16px",
    background: "#ffffff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
  }),

label: {
  display: "block",          // ✅ important
  marginTop: "18px",         // space above label
  marginBottom: "6px",       // space between label & input
  fontSize: "14px",
  fontWeight: "600",
  color: "#334155",
},

input: {
  width: "100%",
  padding: "12px 14px",
  marginTop: "0px",          // ❌ remove extra gap
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  outline: "none",
  transition: "0.2s",
},

  totalBox: {
    marginTop: "22px",
    padding: "16px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #e0f2fe, #dbeafe)",
    textAlign: "center",
    fontWeight: "700",
    fontSize: "16px",
    color: "#1e40af",
  },

  saveBtn: {
    marginTop: "25px",
    padding: "14px",
    width: "100%",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "0.3s",
  },
};