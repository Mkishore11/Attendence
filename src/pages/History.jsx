import { getAllAttendance } from "../utils/storage";

function History() {
  const data = getAllAttendance();

  return (
    <div>
      <h2>Attendance History</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(data).map(([date, val]) => (
            <tr key={date}>
              <td>{date}</td>
              <td>{val.present}</td>
              <td>{val.absent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;