import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    return (

        <div>

            <h1>Dashboard</h1>

            <hr />

            <button

                onClick={() => navigate("/students")}

            >

                Students

            </button>

        </div>

    );

}

export default Dashboard;