import { useState, useEffect } from "react";

import StudentCard from "../components/StudentCard";
import StatCard from "../components/StatCard";

function Dashboard() {

    // ----------------------------
    // State
    // ----------------------------

    const [students] = useState([
        {
            id: 1,
            name: "Rahul",
            score: 92
        },
        {
            id: 2,
            name: "Surya",
            score: 89
        },
        {
            id: 3,
            name: "Bhanu",
            score: 95
        }
    ]);

    const [buttonText, setButtonText] = useState("Create Session");

    // ----------------------------
    // useEffect
    // ----------------------------

    useEffect(() => {
        console.log("Dashboard Loaded Successfully");
    }, []);

    // ----------------------------
    // UI
    // ----------------------------

    return (

        <div style={{ padding: "30px" }}>

            <h1>Admin Dashboard</h1>

            <hr />

            <h2>Statistics</h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "30px"
                }}
            >

                <StatCard
                    title="Students"
                    value={students.length}
                />

                <StatCard
                    title="Rooms"
                    value="25"
                />

                <StatCard
                    title="Sessions"
                    value="3"
                />

                <StatCard
                    title="Recommendations"
                    value="18"
                />

            </div>

            <hr />

            <h2>Students</h2>

            {
                students.map((student) => (

                    <StudentCard
                        key={student.id}
                        name={student.name}
                        score={student.score}
                    />

                ))
            }

            <br />

            <button
                onClick={() => setButtonText("Creating...")}
            >
                {buttonText}
            </button>

        </div>

    );
}

export default Dashboard;