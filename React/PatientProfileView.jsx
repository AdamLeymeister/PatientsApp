import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import { PencilFill } from "react-bootstrap-icons";
import { deleteHorse } from "services/horseProfilesService";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./patientprofile.css";
import toastr from "toastr";
import { string } from "yup";
import * as horseService from "services/horseProfilesService";
import VetPatientView from "./components/VetPatientView";
import OwnerPatientView from "./components/OwnerPatientView";

export default function PatientProfileView(props) {
  const [patientState, setPatient] = useState({
    id: "",
    name: "",
    weight: 0,
    age: 0,
    color: "",
    primaryImageUrl: "",
    breedTypeId: { id: 0, name: "" },
    stateId: 0,
    city: "",
    zip: "",
    lineOne: "",
    lineTwo: "",
    dosage: 0,
    dosageUnit: "",
    numberDoses: 0,
    frequency: "",
    startDate: "",
    distance: 0,
    locationTypeId: 1,
    horseFiles: [],
    horseMedications: [],
  });
  const [patientComponents, setPatientComponents] = useState({
    patientMedications: [],
    patientFiles: [],
  });
  const navigate = useNavigate();
  const [horse, setHorse] = useState("");
  const { id } = useParams();
  const { state } = useLocation();
  const { roles } = props.currentUser;

  useEffect(() => {
    if (id) {
      setHorse(id);
    }
    if (state) {
      if (state?.type !== "HORSE-OBJ") {
        return;
      }
      const { payload } = state;
      const { ...patientObj } = payload;
      const ns = { ...patientObj };
      if (patientObj !== patientState) {
        setPatient((prevState) => {
          let newState = { ...prevState };
          newState = ns;
          newState.id = id;
          newState.locationTypeId = ns.horseLocation.LocationType;
          return newState;
        });
        mapHorseData();
      }
    } else {
      horseService
        .getByHorseId(id)
        .then(onExternalNavigation)
        .catch(onPatientError);
    }
  }, [horse]);

  const navTo = (horse, name) => {
    const sendState = { type: "HORSE-OBJ", payload: horse };
    navigate(`/owner/patient/${patientState.id}/${name}`, {
      state: sendState,
    });
  };

  const onCardClick = (e) => {
    const { name } = e.target;
    if (name) {
      navTo(patientState, name);
    }
  };

  const onExternalNavigation = (res) => {
    const ns = res.item;
    setPatient((prevState) => {
      let newState = { ...prevState };
      newState = ns;
      newState.locationTypeId = ns.horseLocation.LocationType;
      return newState;
    });
    mapHorseData();
  };
  const mapHorseData = () => {
    setPatientComponents((ps) => {
      const ns = { ...ps };
      ns.patientMedications =
        patientState.horseMedications.map(renderMedications);
      ns.patientFiles = patientState.horseFiles.map(renderFiles);
      return ns;
    });
  };
  const onPatientDelete = () => {
    deleteHorse(patientState.id).then(onPatientSuccess).catch(onPatientError);
  };

  const onPatientError = () => {
    toastr.error("There was a network error!");
  };
  const onPatientSuccess = () => {
    navigate("/owner/patients");
    toastr.success("Success!");
  };

  const renderMedications = (medication) => {
    return (
      <tr key={`med_${medication.name}`}>
        <td>{medication.name}</td>
        <td>{medication.dosage}</td>
        <td>{medication.dosageUnit}</td>
        <td>{medication.numberDoses}</td>
        <td>{medication.frequency}</td>
        <td>{medication.manufacturer}</td>
        <td>{medication.startDate}</td>
      </tr>
    );
  };

  const renderFiles = (file) => {
    return (
      <div key={`file_${file.url}`}>
        <Row>
          <Col sm="3">
            <PencilFill />
          </Col>
          <Col sm="9">
            <img className="horsefiles-img" src={`${file.url}`} alt="file" />
            <p>{file.name}</p>
          </Col>
        </Row>
        <hr />
      </div>
    );
  };

  return (
    <>
      {roles.includes("Vet") ? (
        <VetPatientView
          onPatientDelete={onPatientDelete}
          onCardClick={onCardClick}
          patientComponents={patientComponents}
          patientState={patientState}
        />
      ) : (
        <OwnerPatientView
          onPatientDelete={onPatientDelete}
          onCardClick={onCardClick}
          patientComponents={patientComponents}
          patientState={patientState}
        />
      )}
    </>
  );
}

PatientProfileView.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(string).isRequired,
  }).isRequired,
};
