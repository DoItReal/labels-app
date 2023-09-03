import './Nav1.css';
//import 'bootstrap/dist/css/bootstrap.css';
import { IenableStates } from '../App'; 
import { Iuser } from '../Login/Login';
import { useEffect, useRef } from 'react';

interface Inav extends IenableStates {
    user: Iuser
    logout: ()=>void
};
export function Nav({enableStates, updateStates, user, logout }: Inav) {
    return (
        <nav className="navbar navbar-expand-custom navbar-mainbg">
            <Logo />
            <ButtonToogle />
            <NavList enableStates={enableStates} updateStates={updateStates } />
            <User user={user} logout={logout } />
        </nav>
     
    );
}
function User({ user, logout }: { user: Iuser, logout:()=>void }) {
    return (
        <div className="nav-user">
            <p><label>User: </label> {user.username}</p>
            <p><label>Email: </label>{user.email}</p>
            <button onClick={logout }>Logout</button>
            </div>
        );
}
function Logo() {
    return (
        <a className="navbar-brand navbar-logo" href="#">Labels</a>
        );
}
function ButtonToogle() {
    return (
        <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <i className="fas fa-bars text-white">Menu</i>
        </button>
        );
}

function NavList({enableStates,updateStates }:IenableStates) {
    const init = useRef(false);
    const log = (event: React.MouseEvent) => {
        setActive(event);
        updateHori();
    }
    useEffect(() => {
        if (!init.current) {
            updateHori();
            init.current = true;
        }
    });
    const updateHori = () => {

        let tmp = document.querySelector('#navbarSupportedContent');
        if (!tmp || !(tmp instanceof HTMLElement)) {
            throw new Error('Failed to get HTML Element #navbarSuppoertedContent');
        }

        var tabsNewAnim = tmp;
        tmp = tabsNewAnim.querySelector('ul .active');
        if (!tmp || !(tmp instanceof HTMLElement)) {
            throw new Error('Failed to get HTML Element #navbarSuppoertedContent ul .active');
        }
        var activeItemNewAnim = tmp;
        var activeWidthNewAnimWidth = activeItemNewAnim.getBoundingClientRect().width;
        var activeWidthNewAnimHeight = activeItemNewAnim.getBoundingClientRect().height;
        var itemPosNewAnimTop = activeItemNewAnim.getBoundingClientRect().top;

        tmp = document.querySelector('.navbar-logo');
        if (!tmp || !(tmp instanceof HTMLElement)) {
            throw new Error('Failed to get HTML Element .navbar-logo');
        }
        var itemPosNewAnimLeft = activeItemNewAnim.getBoundingClientRect().left - tmp.getBoundingClientRect().width - 20;

        tmp = document.querySelector(".hori-selector");
        if (!tmp || !(tmp instanceof HTMLElement)) {
            throw new Error('Failed to get HTML Element .hori-selector');
        }
        tmp.setAttribute('style', 'top: ' + itemPosNewAnimTop + 'px; left: ' + itemPosNewAnimLeft + 'px; height: ' + activeWidthNewAnimHeight + 'px; width: ' + activeWidthNewAnimWidth + 'px;');

    };

    const setActive = (event: React.MouseEvent) => {
        document.querySelectorAll('#navbarSupportedContent ul li').forEach((item) => item.classList.remove("active"));
        event.currentTarget.className += ' active';
    };
    const createPDF = (event: React.MouseEvent) => {
        log(event);
        let k = "createPDF";
        updateStates(k, true);
        updateStates("updatePDF", true);
    };
    const createNewLabel = (event: React.MouseEvent) => {
        log(event);
        let k = "createLabel"; 
        updateStates(k, true);

        
    };
    const overview = (event: React.MouseEvent) => console.log('Overview');
    return (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
                <div className="hori-selector"><div className="left"></div><div className="right"></div></div>
                <NavItem active="active" func={log} nameClass="overview" name="Overview" />
                <NavItem active="" func={createNewLabel} nameClass="create-label" name="Create Label" />
                <NavItem active="" func={createPDF} nameClass="pdf" name="Create PDF" />
                <NavItem active="" func={log} nameClass="load-labels" name="Test" />
                <NavItem active="" func={ log} nameClass="Test2" name="Test 2" />
                <NavItem active="" func={ log } nameClass="-chart-bar" name="Charts" />
            </ul>
        </div>
       
        );
}

function NavItem({ active, func, nameClass, name }: { active: string, func: (event:React.MouseEvent)=>void, nameClass: string, name: string }) {
    active = "nav-item " + active;
    nameClass = "far fa-" + nameClass;
    return (
        <li className={active} onClick={func}  >
            <a className="nav-link" href="#">
                <i className={nameClass}>{ name }</i>
            </a> 
        </li>
    );
}