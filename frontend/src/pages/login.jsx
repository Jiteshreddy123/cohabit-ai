import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    function handleLogin() {

        navigate("/dashboard");

    }

    return (

        <div>

            <h1>Cohabit-AI</h1>

            <h2>Admin Login</h2>

            <input

                type="email"

                placeholder="Email"

            />

            <br />

            <br />

            <input

                type="password"

                placeholder="Password"

            />

            <br />

            <br />

            <button

                onClick={handleLogin}

            >

                Login

            </button>

        </div>

    );

}

export default Login;