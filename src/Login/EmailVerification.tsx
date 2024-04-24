//create email verification component which will send request to server to verify email i have backend implementation just need to post a request with the verification hash
import { address } from "../DB/Remote/server";
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

function VerificationComponent () {
    const { verificationHash } = useParams();
    const [response, setResponse] = useState(false);
    useEffect(() => {
        console.log(verificationHash);
        const verifyEmail = async () => {
            try {
                await fetch(`${address}verificate/${verificationHash}`).then(()=> setResponse(true)); // Assuming your backend URL is relative
            
            } catch (error) {
                console.error('Error verifying email:', error);   
            }
        };

        verifyEmail();
    }, [verificationHash]);

    return (
        <React.Fragment>
            {response ? <p>Email verified successfully!</p>
            :
            <p>Verifying email...</p>
            }
        </React.Fragment>
    );
};

export default VerificationComponent;

