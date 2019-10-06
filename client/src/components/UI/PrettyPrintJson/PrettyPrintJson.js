import React from 'react';

const prettyPrintJson = (props) => {
    return props.children 
        ? (
            <div><pre>{ JSON.stringify(props.children, null, 2) }</pre></div>
        )
        : null;
}

export default prettyPrintJson;
