import { useHistory, Link } from "react-router-dom";
import { Navbar, Nav, Container, Row } from "react-bootstrap";
import { MdRefresh } from "react-icons/md";
import AppClock from "./AppClock";

export type MenuBarProps = {};
const MenuBar = (props: MenuBarProps) => {
  const history = useHistory();
  const linkStyle = { color: "black", fontSize: "2rem" };
  return (
    <Navbar
      fixed="bottom"
      style={{ padding: "0", backgroundColor: "#eeeeeeee" }}
    >
      <Container>
        <Nav variant="pills" activeKey={history.location.pathname}>
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
        <Container />
        <AppClock />
        <Container>
          <Row className="flex-center">
            <b>Restart Simulation</b>
          </Row>
          <Row className="flex-center">
            <MdRefresh
              fontSize="4.5rem"
              style={{ cursor: "pointer", display: "block", margin: "auto" }}
              onClick={() => {
                window.location.reload();
              }}
            />
          </Row>
        </Container>
      </Container>
    </Navbar>
  );
};
export default MenuBar;
