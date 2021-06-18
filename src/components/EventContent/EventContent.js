import React, {useEffect, useState} from "react";
import {Modal, Button} from "react-bootstrap";
import axios from "axios";
import config from "../../Helpers/config.json";
import useFullPageLoader from "../../hooks/useFullPageLoader/useFullPageLoader";
import EventCard from "../EventCard/EventCard";

const EventContent = ({modelInfo, show, handleClose}) => {
    const [id] = useState(modelInfo.id)
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [eventDetails, setEventDetails] = useState([]);

    useEffect(() => {
        showLoader();
        const loadEventDetails = async () => {
            await axios.get(`${config.apiUrl}/events/${id}`, {
                auth: config.authorization,
            })
                .then(response => {
                    setEventDetails(response.data)
                    hideLoader();
                });
        };
        loadEventDetails();
    }, [id]);
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{modelInfo.positionName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    eventDetails.id ?
                        <div>
                            <div>
                                <ul>
                                    <ol> Position Name:  {modelInfo.positionName}</ol>
                                    <ol> Start Time:  {eventDetails.startsAt}</ol>
                                    <ol> End Time:  {eventDetails.endsAt}</ol>
                                </ul>
                            </div>
                            {eventDetails.employees.map(employee =>  <EventCard  key={employee.id} employee={employee}/>)}
                        </div>
                        :
                        loader
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}
export default EventContent;