import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import Sidebar from "../Sidebar/Sidebar";
import MobileNavbar from "../Mobile Navbar/MobileNavbar";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [newProject, setNewProject] = useState("");

  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ Resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Auto close sidebar
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [isMobile]);

  // 🔹 Add Employee
  const handleAddEmployee = async () => {
    if (!name.trim()) return alert("Enter employee name");

    await addDoc(collection(db, "employees"), {
      name,
      createdAt: new Date(),
    });

    alert("Employee Added ✅");
    setName("");
  };

  // 🔹 Add Project
  const handleAddProject = async () => {
    if (!newProject.trim()) return alert("Enter project name");

    await addDoc(collection(db, "projects"), {
      projectName: newProject,
      createdAt: new Date(),
    });

    alert("Project Added ✅");
    setNewProject("");
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
            width: isMobile ? "220px" : "auto",
            height: "100%",
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
          marginLeft: isMobile ? "0" : (isOpen ? "250px" : "80px"),
          padding: isMobile ? "15px" : "30px",
          minHeight: "100vh",
        }}
      >

        {/* 🔥 MOBILE HEADER */}
        {isMobile && (
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            
          }}>
           

            {/* <h3 style={{ marginLeft: "10px", textalign:"center" }}>Add Employee</h3> */}
          </div>
        )}

        {/* 🔥 CONTENT */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            width: "100%",
            maxWidth: isMobile ? "100%" : "800px",
            margin: "0 auto",
            position:"relative",
            right:"10px"
          }}
        >

          {/* Employee */}
          <div style={styles.card(isMobile)}>
            <h2 style={styles.heading}>👨‍🔧 Add Employee</h2>

            <label style={styles.label}>Employee Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />

            <button style={styles.saveBtn} onClick={handleAddEmployee}>
              ➕ Add Employee
            </button>
          </div>

          {/* Project */}
          <div style={styles.card(isMobile)}>
            <h2 style={styles.heading}>📁 Add Project</h2>

            <label style={styles.label}>Project Name</label>
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              style={styles.input}
            />

            <button style={styles.projectBtn} onClick={handleAddProject}>
              ➕ Add Project
            </button>
          </div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default AddEmployee;

// 🎨 Styles
const styles = {
  heading: {
    marginBottom: "15px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "700",
  },

  card: (isMobile) => ({
    width: "100%",
    maxWidth: isMobile ? "100%" : "350px",
    padding: isMobile ? "16px" : "25px",
    borderRadius: "14px",
    background: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  }),

  label: {
    fontSize: "13px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "12px",
  },

  saveBtn: {
    width: "100%",
    padding: "10px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },

  projectBtn: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
};