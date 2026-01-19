const Test = () => {
    const imageUrl = "https://drive.google.com/thumbnail?id=1d_SQ1l_2r1Ud2a6yAhTntLxD4BSO30xf&sz=w1000";

    return (
        <div>
            <h1>Ảnh từ Google Drive</h1>
            <img src={imageUrl} alt="Ảnh từ Google Drive" style={{ width: "100%", height: "auto" }} />
        </div>
    );
};

export default Test;