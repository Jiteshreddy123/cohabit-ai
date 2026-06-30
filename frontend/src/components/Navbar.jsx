function Navbar() {
    return (
        <nav style={{
            backgroundColor: "#1f2937",
            color: "white",
            padding: "15px",
            display: "flex",
            justifyContent: "space-between"
        }}>
            <h2>Cohabit-AI</h2>

            <div>
                <span>Admin</span>
            </div>
        </nav>
    );
}

export default Navbar;