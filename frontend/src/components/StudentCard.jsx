function StudentCard({ name, score }) {

    return (

        <div
            style={{
                border: "1px solid gray",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px"
            }}
        >

            <h3>{name}</h3>

            <p>Compatibility Score : {score}%</p>

        </div>

    );

}

export default StudentCard;