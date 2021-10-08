import React from "react";
import { useHistory, Link } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { MdRefresh } from "react-icons/md";
import AppClock from "./AppClock";

export default function MenuBar(props) {
  const history = useHistory();
  const linkStyle = {
    borderStyle: "solid",
    borderColor: "black",
    backgroundColor: "white",
    color: "black",
  };

  return (
    <Navbar style={{ fontSize: "2em" }} fixed="bottom">
      <Container style={{ backgroundColor: "light-grey" }}>
        <Nav activeKey={history.location.pathname} className="me-auto">
          <Link style={linkStyle} className="p-2" to="/home">
            Home
          </Link>
          <Link style={linkStyle} className="p-2" to="/control">
            Control
          </Link>
          <Link style={linkStyle} className="p-2" to="/analysis/">
            Analysis
          </Link>
        </Nav>
        <AppClock />
        <Container
          className="m-2"
          style={{ fontSize: "0.5em", justifyContent: "center" }}
        >
          <b>Restart Simulation</b>
          <MdRefresh
            fontSize="5em"
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.location.reload();
            }}
          />
        </Container>
      </Container>
    </Navbar>
  );
}

export { MenuBar };
