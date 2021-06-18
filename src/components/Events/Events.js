import React, {useEffect, useState} from "react";
import useFullPageLoader from "../../hooks/useFullPageLoader/useFullPageLoader";
import config from "../../Helpers/config.json";
import axios from "axios";
import TablePagination from "../../utilities/DataTable/TablePagination/TablePagination";
import TableHeader from "../../utilities/DataTable/TableHeader/TableHeader";
import TableSearch from "../../utilities/DataTable/TableSearch/TableSearch";
import EventContent from "../EventContent/EventContent";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(10);
    const [paginationLimit, setPaginationLimit] = useState(20);
    const [modalInfo, setModalInfo] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchField, setSearchField] = useState('');


    useEffect(() => {
        modalInfo.id && setShow(true);
    }, [modalInfo])
    const headers = [
        {name: "id", field: "id", type: 'input'},
        {name: "Position Name", field: "positionName", type: "input"},
        {name: "Start time", field: "startsAt", type:"date"},
        {name: "End time", field: "endTime", type: "date"}
    ]
    useEffect(() => {
        showLoader();
        const loadEvents = async () => {
            await axios.get(`${config.apiUrl}/events`, {
                auth: config.authorization,
                params: {
                    limit: paginationLimit
                }
            })
                .then(response => {
                    const data = response.data.items.map(result => {
                        return {
                            positionName: result.position.name,
                            id: result.id,
                            startsAt: new Date(result.startsAt).toLocaleString(),
                            endsAt: new Date(result.endsAt).toLocaleString()
                        }
                    })
                    hideLoader();
                    setEvents(data);
                });
        };
        loadEvents();
    }, [paginationLimit]);
    const indexOfLastEvent =  currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

    useEffect(() => {
        if(!searchValue) return setEvents(events);
        // setEvents([]);

    }, [searchValue, searchField])

    const currentEvents =  events.slice(indexOfFirstEvent, indexOfLastEvent)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const onClickLoadMore = () => setPaginationLimit(paginationLimit + 20)
    const filterParameters = (searchParam) => {
        setSearchValue(searchParam.target.value);
        setSearchField(searchParam.target.attributes["rk-model"].value)
    }
    return (
        <div className="main-content">
            <main>
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <TablePagination eventsPerPage={eventsPerPage} totalEvents={events.length} paginate={paginate}/>
                        </div>
                        {loader}
                    </div>
                    <table  id="dtBasicExample" className="table table-striped table-bordered table-sm" cellSpacing="0" width="100%">
                        <caption>
                            <button type="button" className="btn btn-primary" onClick={onClickLoadMore}>Load More</button>
                        </caption>
                        <TableHeader headers={headers}/>
                        <tbody>
                        <tr>
                            {headers.map(head => (<td key={head.field} className="th-sm">
                                <TableSearch search={head} filterParameters={filterParameters}/></td>))}
                        </tr>
                        {currentEvents.length > 0 && currentEvents.map( event => {
                            return ( <tr key={event.id} onClick={() => setModalInfo(event)}>
                                <td>{event.id}</td>
                                <td>{event.positionName}</td>
                                <td>{event.startsAt}</td>
                                <td>{event.endsAt}</td>
                            </tr>)
                        })}
                        </tbody>
                    </table>

                </div>
                { show ? <EventContent handleClose={handleClose} modelInfo={modalInfo} show={show}/>: null}
            </main>
        </div>



    )
}
export default Events;