import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useHistory, Link } from 'react-router-dom';
import AppClock from "./AppClock";
import { MdRefresh } from "react-icons/md"

export default function MenuBar(props) {
    const history = useHistory();
    const linkStyle = {
        borderStyle: "solid", 
        borderColor: "black", 
        backgroundColor: "white", 
        color: "black"
    };

    return (
        <Navbar style={{fontSize: "2em"}} fixed="bottom">    
            <Container style={{backgroundColor: "grey"}}>
            <Nav activeKey={history.location.pathname} className="me-auto">
            <Link style={linkStyle} className="p-2" to="/home">Home</Link>
            <Link style={linkStyle} className="p-2" to="/control">Control</Link>
            <Link style={linkStyle} className="p-2" to="/analysis/">Analysis</Link>
            </Nav>
            <AppClock />
            <Container className="m-2" style={{fontSize: "0.5em"}}>
                <b>Restart Simulation</b>
                <br />
                <MdRefresh fontSize="5em" onClick={() => {window.location.reload();}} />
            </Container>
            </Container> 
        </Navbar>
    );
}

export { MenuBar };
