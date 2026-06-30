function StatCard({ title, value }) {

    return (

        <div
            style={{
                border: "1px solid black",
                padding: "20px",
                width: "170px",
                borderRadius: "8px",
                textAlign: "center"
            }}
        >

            <h3>{title}</h3>

            <h1>{value}</h1>

        </div>

    );

}

export default StatCard;