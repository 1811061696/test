import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Grid, Row, Col, Icon } from "rsuite";
import { faBell } from "@fortawesome/free-regular-svg-icons";

import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import Sidebar from "../Sidebar";
import { useEffect, useState } from "react";
const cx = classNames.bind(styles);

function Header() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showIconMenu, setShowIconMenu] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    const firstName = localStorage.getItem("lastName");
    const lastName = localStorage.getItem("firstName");
    setNameUser(firstName + " " + lastName);
  }, []);

  const handleOpenSidebar = () => {
    console.log(showSidebar);
    setShowSidebar(!showSidebar);
  };

  window.addEventListener("resize", function (event) {
    if (window.innerWidth < 990) {
      setShowIconMenu(true);
    } else {
      setShowIconMenu(false);
    }
  });

  const showLogoutForm = () => {
    setLogout(!logout);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setLogout(false);
    window.location.reload();
  };
  return (
    <header className={cx("header")}>
      <Grid fluid>
        <Row className="show-grid">
          <Col xs={12} style={{ display: "flex" }}>
            <h1 className={cx("header__title")}>CRUD</h1>
            {showIconMenu === true ? (
              <Icon
                style={{ marginTop: 10, marginLeft: 8 }}
                onClick={handleOpenSidebar}
                icon="bars"
              >
                {showSidebar === true ? <Sidebar /> : ""}
              </Icon>
            ) : (
              ""
            )}
          </Col>
          <Col xs={12}>
            <div className={cx("header__information")}>
              <FontAwesomeIcon icon={faBell} className={cx("bell_icon")} />
              {nameUser !== "" ? (
                <p className={cx("user_title")}>{nameUser}</p>
              ) : (
                ""
              )}
              <div className={cx("user_option")}>
                <img
                  src="https://nld.mediacdn.vn/2020/5/29/doi-hoa-tim-5-1590731334546464136746.jpg"
                  alt=""
                  onClick={showLogoutForm}
                />
                {logout === true ? (
                  <div className={cx("option")} onClick={handleLogout}>
                    <h1>Đăng xuất</h1>
                    <Icon icon="sign-out" />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    </header>
  );
}

export default Header;
