import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";

function Students() {

    const [students, setStudents] = useState([]);

    useEffect(() => {
        loadStudents();
    }, []);

    async function loadStudents() {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>

            <h1>Students</h1>

            <table border="1">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Branch</th>
                        <th>Year</th>
                        <th>Gender</th>
                    </tr>
                </thead>

                <tbody>

                    {students.map((student) => (

                        <tr key={student.id}>

                            <td>{student.name}</td>

                            <td>{student.roll_number}</td>

                            <td>{student.branch}</td>

                            <td>{student.year_of_study}</td>

                            <td>{student.gender}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default Students;