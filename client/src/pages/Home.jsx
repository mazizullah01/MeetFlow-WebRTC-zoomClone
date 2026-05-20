import React from "react";

const HomePage = () => {
    return (
        <div className="homepage-container">
            <div>
                <input type="email" placeholder="Enter your email here" />
                <input type="text" placeholder="Enter your Room code" />
                <button>Enter Room</button>
             </div>
        </div>
    )
}

export default HomePage;