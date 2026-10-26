import { useState, useEffect } from "react";
import { getClasses, saveStudents, getStudents } from "../utils/storage";

function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    roll: "",
    className: ""
  });

  useEffect(() => {
    setStudents(getStudents());
    setClasses(getClasses());
  }, []);

  const handleAdd = () => {
    const updated = [...students, form];
    setStudents(updated);
    saveStudents(updated);
  };

  return (
    <div>
      <h2>Add Student</h2>

      <input
        placeholder="Name"
        onChange={(e) => setForm({...form, name: e.target.value})}
      />

      <input
        placeholder="Roll"
        onChange={(e) => setForm({...form, roll: e.target.value})}
      />

      {/* Class Dropdown */}
      <select onChange={(e) => setForm({...form, className: e.target.value})}>
        <option>Select Class</option>
        {classes.map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>

      <button onClick={handleAdd}>Add</button>

      <ul>
        {students.map((s, i) => (
          <li key={i}>
            {s.name} ({s.className})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Students;