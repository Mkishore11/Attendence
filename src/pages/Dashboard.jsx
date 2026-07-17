import { useState, useEffect } from "react";
import { getClasses } from "../utils/storage";
import "../styles/Dashboard.css"; 

function Dashboard() {
  const [date, setDate] = useState(new Date());

function Dashboard() {
  const [selectedClass, setSelectedClass] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = JSON.parse(localStorage.getItem("attendance")) || {};
    setData(stored[today + "_" + selectedClass]);
  }, [selectedClass]);

return (
  <div className="dashboard">

    <h2 className="title">📊 Attendance Dashboard</h2>

    {/* Top Controls */}
    <div className="top-bar">
      <select onChange={(e) => setSelectedClass(e.target.value)}>
        <option>Select Class</option>
        {getClasses().map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>

      <button onClick={() => setDate(new Date())}>📍 Today</button>
    </div>

    {/* Cards Section */}
    {!data ? (
      <div className="no-data">⚠️ No Attendance Data</div>
    ) : (
      <>
        <div className="card-container">
          <div className="card total">👥 Total {data.present + data.absent}</div>
          <div className="card present">✅ Present {data.present}</div>
          <div className="card absent">❌ Absent {data.absent}</div>
          <div className="card percent">
            📊 {Math.round((data.present / (data.present + data.absent)) * 100)}%
          </div>
        </div>

        {/* Progress */}
        <div className="progress-section">
          <h3>Attendance Progress</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.round((data.present / (data.present + data.absent)) * 100)}%`
              }}
            ></div>
          </div>
        </div>

        {/* Extra Info Section */}
        <div className="info-grid">
          <div className="info-box">📅 Working Days: 22</div>
          <div className="info-box">🎓 Classes: 3</div>
          <div className="info-box">⏰ Last Updated: Today</div>
        </div>
      </>
    )}
  </div>
);
}
}

export default Dashboard;