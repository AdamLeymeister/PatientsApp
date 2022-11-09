import React from "react";
import { Card, Button, Row, Col, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import ListGroup from "react-bootstrap/ListGroup";
import "../patientprofile.css";
export default function VetPatientView(props) {
  return (
    <div>
      <Row className="horse-addform-wrapper patient-view-wrapper">
        <Col lg="4" className="mt-4 mb-4">
          <Card className="mb-4">
            <Card.Body className="text-center">
              <Card.Img
                src={props.patientState.primaryImageUrl}
                alt="avatar"
                className="rounded-circle patient-view-profile"
              />
              <p className="text-muted mb-4">
                <b>Name: </b>
                {props.patientState.name}
              </p>
              <ListGroup className="patient-view-listgroup">
                <p className="text-muted mb-1">
                  <b>Breed: </b>
                  {props.patientState.breedTypeId.name}
                </p>
                <p className="text-muted mb-1">
                  <b>Age: </b>
                  {props.patientState.age}
                </p>
                <p className="text-muted mb-4">
                  <b>Weight: </b>
                  {props.patientState.weight}
                </p>
              </ListGroup>

              <div className="d-flex justify-content-center mb-2">
                <Button
                  name="edit"
                  className="horse-card-icons"
                  onClick={props.onCardClick}
                >
                  <PencilFill />
                  Edit
                </Button>
                <Button
                  name="delete"
                  onClick={props.onPatientDelete}
                  className="ms-1 btn-danger horse-card-icons"
                >
                  <TrashFill />
                  Remove
                </Button>
              </div>
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Title className="mt-2">Files</Card.Title>
            <Card.Body>
              {props.patientComponents.patientFiles.length > 0
                ? props.patientComponents.patientFiles
                : "No files have been added"}
            </Card.Body>
          </Card>
        </Col>
        <Col className="mt-4 mb-4 patient-contact-card" lg="6">
          <Card className="mb-4">
            <Card.Title className="mt-2">
              Primary Contact Information
            </Card.Title>
            <Card.Body>
              <Row>
                <Col sm="3">
                  <p>Full Name</p>
                </Col>
                <Col sm="9">
                  <p className="text-muted">
                    {props.patientState?.ownerInfo?.firstName}{" "}
                    {props.patientState?.ownerInfo?.lastName}
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="3">
                  <p>Email</p>
                </Col>
                <Col sm="9">
                  <p className="text-muted">
                    {props.patientState?.ownerInfo?.email}
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="3">
                  <p>Phone</p>
                </Col>
                <Col sm="9">
                  <p className="text-muted">(097) 234-5678</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="3">
                  <p>City</p>
                </Col>
                <Col sm="9">
                  <p className="text-muted">
                    {props.patientState?.horseLocation?.city}
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="3">
                  <p>State</p>
                </Col>
                <Col sm="9">
                  <p className="text-muted">
                    {props.patientState?.horseLocation?.state.name}
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="3">
                  <p>Address 1</p>
                </Col>
                <Col sm="9">
                  <p className="text-muted">
                    {props.patientState?.horseLocation?.lineOne}
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="3">
                  <p>Zip Code</p>
                </Col>
                <Col sm="9">
                  <p className="text-muted">
                    {props.patientState?.horseLocation?.zip}
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="3">
                  <p>Type</p>
                </Col>
                <Col sm="9">
                  <p className="text-muted">
                    {props.patientState?.horseLocation?.locationType.name}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-4 patient-table">
            <Card.Title className="mt-2">Medications</Card.Title>
            {props.patientComponents.patientMedications.length > 0 ? (
              <Table striped bordered hover size="sm" responsive>
                <thead>
                  <tr>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Unit</th>
                    <th># Doses</th>
                    <th>Frequency</th>
                    <th>Manufacturer</th>
                    <th>Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {props.patientComponents.patientMedications.length > 0
                    ? props.patientComponents.patientMedications
                    : "No medications have been added yet"}
                </tbody>
              </Table>
            ) : (
              <div className="mb-5 mt-5">
                No medications have been added yet
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
VetPatientView.propTypes = {
  patientState: PropTypes.shape({
    id: PropTypes.string.isRequired,
    primaryImageUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    distance: PropTypes.number.isRequired,
    weight: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    breedTypeId: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    horseLocation: PropTypes.shape({
      state: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
      locationType: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }).isRequired,
      id: PropTypes.number.isRequired,
      city: PropTypes.string.isRequired,
      lineOne: PropTypes.string.isRequired,
      lineTwo: PropTypes.string.isRequired,
      zip: PropTypes.string.isRequired,
    }),
    ownerInfo: PropTypes.shape({
      id: PropTypes.number,
      avatarUrl: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      isConfirmed: PropTypes.bool.isRequired,
    }),
  }).isRequired,
  patientComponents: PropTypes.shape({
    patientMedications: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        dosage: PropTypes.number,
        dosageUnit: PropTypes.string,
        frequency: PropTypes.string,
        numberDoses: PropTypes.number,
        startDate: PropTypes.instanceOf(Date)
      })
    ).isRequired,
    patientFiles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        url: PropTypes.string,
        name: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  onPatientDelete: PropTypes.func.isRequired,
  onCardClick: PropTypes.func.isRequired,
};
