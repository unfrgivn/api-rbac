import React from 'react';
import JSONbig from 'json-bigint';

const prettyPrintJson = (props) => {
    return props.children 
        ? (
            <div><pre>{ JSONbig.stringify(props.children, null, 2) }</pre></div>
        )
        : null;
}

export default prettyPrintJson;
