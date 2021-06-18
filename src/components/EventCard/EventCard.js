import React from "react";
import profilePicture from "../../images/richard.jpg";


const EventCard = ({employee}) => {

    return (
        <div className="card" style={{width: "30rem"}}>
            <div className="user-wrapper">
                <img src={employee.image} width="60px" height="60px" alt=""/>
                <div>
                    <h6> First Name : {employee.firstName} </h6>
                    <h6> Last Name: {employee.lastName}</h6>
                </div>
            </div>
        </div>
    )
}
export default EventCard;