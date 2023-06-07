import React from "react";

const SingleMessage = ({ message, letter, leftAlign, parseDate }) => {
    return (
        <div className="d-flex align-items-center mb-3">
            {
                leftAlign ?
                    <>
                        <div className="avatar-xsm me-2 border border-success rounded-circle d-flex align-items-center justify-content-center">
                            <p className="mb-0"><b>{letter}</b></p>
                        </div>
                        <div>
                            <p className="mb-0">{message.content}</p>
                            <p className="mb-0 text-secondary">{parseDate(message.postDate)}</p>
                        </div>
                    </>
                    :
                    <>
                        <div className="ms-auto d-flex flex-column">
                            <p className="mb-0 ">{message.content}</p>
                            <p className="mb-0 ms-auto text-secondary">{parseDate(message.postDate)}</p>
                        </div>
                        <div className="avatar-xsm ms-2 border border-primary rounded-circle d-flex align-items-center justify-content-center">
                            <p className="mb-0"><b>{letter}</b></p>
                        </div>
                    </>
            }
        </div>
    );
};

export default SingleMessage;