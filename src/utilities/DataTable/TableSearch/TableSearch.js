import React from 'react';

const TableSearch = ({search, filterParameters}) => {
    return (
        <input
            onChange={ event => filterParameters(event)}
            type={search.type}
            rk-model={search.field}
            className="form-control"
            style={{width: "200px"}}
            placeholder={search.name}
        />
    )
}
export default TableSearch;