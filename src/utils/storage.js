// -------------------- CLASS --------------------
export const saveClasses = (classes) => {
  localStorage.setItem("classes", JSON.stringify(classes));
};

export const getClasses = () => {
  return JSON.parse(localStorage.getItem("classes")) || [];
};

// -------------------- STUDENTS --------------------
export const saveStudents = (students) => {
  localStorage.setItem("students", JSON.stringify(students));
};

export const getStudents = () => {
  return JSON.parse(localStorage.getItem("students")) || [];
};

// -------------------- ATTENDANCE --------------------

// ✅ SAVE ATTENDANCE
export const saveAttendance = (key, data) => {
  const existing = JSON.parse(localStorage.getItem("attendance")) || {};
  existing[key] = data;
  localStorage.setItem("attendance", JSON.stringify(existing));
};

// ✅ GET SINGLE ATTENDANCE
export const getAttendance = (key) => {
  const data = JSON.parse(localStorage.getItem("attendance")) || {};
  return data[key];
};

// ✅ GET ALL ATTENDANCE (for History page)
export const getAllAttendance = () => {
  return JSON.parse(localStorage.getItem("attendance")) || {};
};