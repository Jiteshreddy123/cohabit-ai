import { useEffect, useState } from "react";

import { getStudents } from "../services/studentService";

function Students() {

    const [students, setStudents] = useState([]);

    useEffect(() => {

        loadStudents();

    }, []);

    async function loadStudents() {

        const data = await getStudents();

        setStudents(data);

    }

    return (

        <div>

            <h1>Students</h1>

            {
                students.map(student => (

                    <p key={student.id}>

                        {student.name}

                    </p>

                ))
            }

        </div>

    );

}

export default Students;