import React, {useEffect, useState} from "react";
import useFullPageLoader from "../../hooks/useFullPageLoader/useFullPageLoader";
import config from "../../Helpers/config.json";
import axios from "axios";
import TablePagination from "../../utilities/DataTable/TablePagination/TablePagination";
import TableHeader from "../../utilities/DataTable/TableHeader/TableHeader";
import TableSearch from "../../utilities/DataTable/TableSearch/TableSearch";
import EventContent from "../EventContent/EventContent";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";


const Events = () => {
    const [events, setEvents] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(10);
    const [paginationLimit, setPaginationLimit] = useState(20);
    const [modalInfo, setModalInfo] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [queryDataParams, setQueryDataParams] = useState({});

    const [OpenSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if(reason === 'clickaway'){
            return;
        }
        setOpenSnackbar(false)
    }

    useEffect(() => {
        modalInfo.id && setShow(true);
    }, [modalInfo])
    const headers = [
        {name: "id", field: "id", type: 'input'},
        {name: "Position Name", field: "positionName", type: "input"},
        {name: "Start time", field: "startsAt", type:"date"},
        {name: "End time", field: "endTime", type: "date"}
    ]
    const filterParameters = (searchParam) => {
        const searchParamValue =  new Date(searchParam.target.value).toISOString();
        switch (searchParam.target.attributes["rk-model"].value) {
            case 'endTime':
                setQueryDataParams({endsAt: searchParamValue} )
                break;
            case 'startsAt':
                setQueryDataParams({startsAt: searchParamValue} )
                break;
            default:
                setQueryDataParams({} )

        }
    }
    useEffect(() => {
        showLoader();
        const loadEvents = async () => {
            await axios.get(`${config.apiUrl}/events`, {
                auth: config.authorization,
                params: {
                    limit: paginationLimit,
                    ...queryDataParams
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
                }).catch(error => {
                    hideLoader();
                    setOpenSnackbar(true)
                })
        };
        loadEvents();
    }, [paginationLimit, queryDataParams]);
    const indexOfLastEvent =  currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents =  events.slice(indexOfFirstEvent, indexOfLastEvent)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    const onClickLoadMore = () => setPaginationLimit(paginationLimit + 20)

    return (
        <div className="main-content">
            <main>
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <TablePagination eventsPerPage={eventsPerPage} totalEvents={events.length} paginate={paginate}/>
                        </div>
                        {loader}
                        {OpenSnackbar && (
                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                open={OpenSnackbar}
                                autoHideDuration={300}
                                message= 'Missing request data'
                                action={
                                    <React.Fragment>
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            onClick={handleCloseSnackbar}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </React.Fragment>
                                }
                            />
                        )
                        }
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