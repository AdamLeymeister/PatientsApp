import React, { useState, useEffect } from "react";
import OwnerCard from "./components/PatientCard";
import VetCard from "./components/VetPatientCard";
import { Card, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import * as horseService from "services/horseProfilesService";
import "rc-pagination/assets/index.css";
import Pagination from "rc-pagination";
import PropTypes, { string } from "prop-types";
import toastr from "toastr";
import locale from "rc-pagination/lib/locale/en_US";
import debug from "sabio-debug";

function HorseProfiles(props) {
  const _logger = debug.extend("HorseProfiles");
  const navigate = useNavigate();
  const { roles } = props.currentUser;
  const [horseState, setHorseState] = useState({
    horseData: [],
    horseCardComponents: [],
    loading: false,
    paginationData: {
      pageIndex: 0,
      pageSize: 6,
      totalPages: 0,
      totalCount: 0,
      current: 1,
      searchTerm: "",
    },
  });

  useEffect(() => {
    getUserRoles();
  }, [horseState.paginationData.pageIndex]);

  const getUserRoles = () => {
    if (roles.includes("Vet")) {
      return getVetHorses();
    } else {
      return getUserHorses();
    }
  };

  const getUserHorses = () => {
    const { pageIndex, pageSize } = horseState.paginationData;
    horseService
      .getUserHorses(pageIndex, pageSize)
      .then(onHorseSuccess)
      .catch(onHorseError);
  };

  const getVetHorses = () => {
    const { pageIndex, pageSize } = horseState.paginationData;
    horseService
      .getVetHorses(pageIndex, pageSize)
      .then(onHorseSuccess)
      .catch(onHorseError);
  };

  const onHorseSuccess = (res) => {
    const newHorseArr = res.item.pagedItems;
    const newHorseMeta = res.item;
    setHorseState((prevState) => {
      let newState = { ...prevState };
      newState.horseData = newHorseArr;
      newState.horseCardComponents = newHorseArr.map(mapHorseCards);
      newState.paginationData.pageIndex = newHorseMeta.pageIndex;
      newState.paginationData.pageSize = newHorseMeta.pageSize;
      newState.paginationData.totalCount = newHorseMeta.totalCount;
      newState.paginationData.totalPages = newHorseMeta.totalPages;
      return newState;
    });
  };

  const onPageChange = (page) => {
    setHorseState((prevState) => {
      const newState = { ...prevState };
      newState.paginationData.current = page;
      newState.paginationData.pageIndex = newState.paginationData.current - 1;
      newState.loading = !newState.loading;
      return newState;
    });
  };

  const mapHorseCards = (horseCard) => {
    if (roles.includes("Vet")) {
      return (
        <VetCard
          aHorseCard={horseCard}
          currentUser={props.currentUser}
          key={horseCard.id}
        />
      );
    } else {
      return (
        <OwnerCard
          aHorseCard={horseCard}
          currentUser={props.currentUser}
          key={horseCard.id}
        />
      );
    }
  };

  const onAddHorse = () => {
    navigate("/owner/patient/new");
  };

  const onSearchBoxChange = (e) => {
    const { value } = e.target;
    setHorseState((prevState) => {
      let newState = { ...prevState };
      newState.paginationData.searchTerm = value;
      return newState;
    });
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (horseState.paginationData.searchTerm === "") {
      return getUserHorses();
    }
    const { pageIndex, pageSize, searchTerm } = horseState.paginationData;
    horseService
      .searchUserHorses(pageIndex, pageSize, searchTerm)
      .then(onHorseSuccess)
      .catch(onHorseError);
  };

  const handleKeyPress = (e) => {
    if (e.key !== "Enter") return;
    onSearchSubmit(e);
  };

  const onHorseError = (err) => {
    _logger("onHorseError", err);
    toastr.error("There was a network error!");
  };

  return (
    <div className="horse-addform-wrapper">
      <div>
        <Row className="horse-profiles-row mt-3">
          <Col lg={12}>
            <Card className="horseprofiles filter">
              <Card.Body>
                <Form>
                  <Row className="g-3 horse-row">
                    <Col xxl={4} lg={4}>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control"
                          id="search"
                          placeholder="Search All"
                          value={horseState.paginationData.searchTerm}
                          onChange={onSearchBoxChange}
                          onKeyPress={handleKeyPress}
                          name="search"
                        />
                      </div>
                    </Col>

                    <Col xxl={2} lg={6}>
                      <div className="position-relative h-100 hstack gap-3">
                        <button
                          onClick={onAddHorse}
                          type="submit"
                          className="btn btn-primary h-100 w-100"
                        >
                          <i className="bx bx-search-alt align-middle"></i>Add
                          Patient
                        </button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="patient-row-container col-12">
          {horseState.horseCardComponents}
        </Row>
        <Row>
          <Pagination
            className="align-items-center horse-pagination pt-3 pb-3"
            onChange={onPageChange}
            current={horseState.paginationData.current}
            total={horseState.paginationData.totalCount}
            pageIndex={horseState.paginationData.pageIndex}
            pageSize={horseState.paginationData.pageSize}
            locale={locale}
          />
        </Row>
      </div>
    </div>
  );
}

HorseProfiles.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(string).isRequired,
  }).isRequired,
};

export default HorseProfiles;
