import { useState, useEffect } from "react";
import { getStudents, getClasses } from "../utils/storage";
import { saveAttendance } from "../utils/storage";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    setStudents(getStudents());
    setClasses(getClasses());
  }, []);

  const filteredStudents = students.filter(
    (s) => s.className === selectedClass
  );

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const handleSave = () => {
    const today = new Date().toISOString().split("T")[0];

    let present = 0, absent = 0;

    Object.values(data).forEach((v) => {
      if (v === "Present") present++;
      else absent++;
    });

    saveAttendance(today + "_" + selectedClass, { present, absent });
    alert("Saved");
  };

  return (
    <div>
      <h2>Attendance</h2>

      {/* Class Filter */}
      <select onChange={(e) => setSelectedClass(e.target.value)}>
        <option>Select Class</option>
        {classes.map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>

      <table border="1">
        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td>
                <select onChange={(e) => handleChange(s.name, e.target.value)}>
                  <option>Select</option>
                  <option>Present</option>
                  <option>Absent</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default Attendance;