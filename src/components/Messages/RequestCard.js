import React from "react";

const RequestCard = ({ request }) => {
    console.log(request);
    return (
        <p>{request.content}</p>
    );

};

export default RequestCard;