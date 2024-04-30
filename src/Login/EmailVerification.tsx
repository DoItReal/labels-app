//create email verification component which will send request to server to verify email i have backend implementation just need to post a request with the verification hash
import { address } from "../DB/Remote/server";
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

function VerificationComponent () {
    const { verificationHash } = useParams();
    const [response, setResponse] = useState('false');
    useEffect(() => {
        const verifyEmail = async () => {
            await fetch(`${address}verificate/${verificationHash}`).then((response) => {response.status === 200 ? setResponse(response.statusText) : setResponse('failed')}).catch(error => setResponse('failed')); // Assuming your backend URL is relative
        };

        verifyEmail();
    }, [verificationHash]);

    return (
        <React.Fragment>
            {response !== 'false' && response !== 'failed' ? <p>{response}</p>
            : response === 'failed' ? <p>Failed to verify email</p> :
            <p>Verifying email...</p>
            }
        </React.Fragment>
    );
};

export default VerificationComponent;

