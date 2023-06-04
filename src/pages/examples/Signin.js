import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Card, Container } from "@themesberg/react-bootstrap";
import { Link } from "react-router-dom";
import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";
import { FormattedMessage } from "react-intl";
import Login from "../../components/custom/login/Login";

export default () => {
  return (
    <main>
      <section
        className="d-flex align-items-center"
        style={{ minHeight: "100vh" }}>
        <Container>
          <Row
            className="justify-content-center form-bg-image"
            style={{ backgroundImage: `url(${BgImage})` }}>
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">
                    <FormattedMessage id="singInPlatform" />
                  </h3>
                </div>

                <Login />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
