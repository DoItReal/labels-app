import { MutableRefObject, useEffect, useRef, useState } from "react";
import './error.css';
export function ErrorUI({ error, time }: { error: string, time:number }) {
    const [render, setRender] = useState(true);
    const didMount = useRef(false);
    var translation = '1s';
    var opacity = '1';
    const ref = useRef<HTMLDivElement>(null);

    const fade = () => {
        if (!ref.current) return;
        ref.current.style.opacity = '0';
        ref.current.style.transition = '1s'; 
    }
    useEffect(() => {
        if (!didMount.current) {
            if (time > 2000) {
                setTimeout(fade, time - 1000);
                setTimeout(() => setRender(false), time);
            } else {
                if (ref.current) {
                    ref.current.style.transition = time / 2 + 's';
                    setTimeout(() => { if(ref.current) ref.current.style.opacity = '0'; }, time / 2);
                    setTimeout(() => setRender(false), time);
                }
            }
            didMount.current = true;
            return;
        }
        if (ref.current !== null && ref.current.style !== null) {
            ref.current.style.transition = translation;
            ref.current.style.opacity = opacity;
            }
    },[]);

    
    const tmp = {
        position: 'absolute' as 'absolute',
        top: '90%',
        left: '45%'
    }
    return (
        render ?
            <div ref={ref} className="error" style={tmp}><span  >{error}</span></div> : null
    );
}