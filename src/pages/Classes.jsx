import { useState, useEffect } from "react";
import { saveClasses, getClasses } from "../utils/storage";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    setClasses(getClasses());
  }, []);

  const addClass = () => {
    const updated = [...classes, name];
    setClasses(updated);
    saveClasses(updated);
    setName("");
  };

  return (
    <div>
      <h2>Create Class</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter class name"
      />
      <button onClick={addClass}>Add</button>

      <ul>
        {classes.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
}

export default Classes;