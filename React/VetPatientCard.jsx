import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { PencilFill, EyeFill } from "react-bootstrap-icons";
import ListGroup from "react-bootstrap/ListGroup";
import HorseBanner from "../../../assets/images/background/horse-banner.png";
import PropTypes from "prop-types";
import "../patientprofile.css";

function HorseCard(props) {
  const navigate = useNavigate();

  const navTo = (horse, name) => {
    const sendState = { type: "HORSE-OBJ", payload: horse };
    navigate(`/owner/patient/${props.aHorseCard.id}/${name}`, {
      state: sendState,
    });
  };

  const onCardClick = (e) => {
    const { name } = e.target;
    if (name) {
      navTo(props.aHorseCard, name);
    }
  };

  return (
    <div className="horse-card horse-hover layer horse-card-container">
      <Card className="horse-card-background">
        <Card.Img
          className="horse-card-header"
          variant="top"
          src={HorseBanner}
        />
        <Card.Img
          className="horse-profile-image"
          name="view"
          onClick={onCardClick}
          src={props.aHorseCard?.primaryImageUrl}
        />
        <Card.Body>
          <Card.Title></Card.Title>
        </Card.Body>
        <Card.Title className="horsecard-title">
          {props.aHorseCard.name}
        </Card.Title>
        <ListGroup className="list-group-flush">
          <ListGroup.Item className="horse-card-list-item">
            <b>Breed: </b>
            {props.aHorseCard.breedTypeId.name}
          </ListGroup.Item>
          <ListGroup.Item className="horse-card-list-item">
            <b>Age: </b>
            {props.aHorseCard.age}
          </ListGroup.Item>
          <ListGroup.Item className="horse-card-list-item">
            <b>Weight: </b>
            {props.aHorseCard.weight}
          </ListGroup.Item>
          <ListGroup.Item className="horse-card-list-item">
            <b>Owner: </b>
            {props.aHorseCard?.ownerInfo?.firstName}{" "}
            {props.aHorseCard?.ownerInfo?.lastName}
          </ListGroup.Item>
          <ListGroup.Item className="horse-card-list-item">
            <b>Distance: </b>
            {Math.trunc(props.aHorseCard?.distance)}
          </ListGroup.Item>
        </ListGroup>
        <Card.Body className="horse-card-flex-row">
          <Button
            className="horse-card-icons btn-secondary patient-view-button"
            name="view"
            onClick={onCardClick}
          >
            <EyeFill /> View
          </Button>
          <Button
            className="horse-card-icons"
            name="edit"
            onClick={onCardClick}
          >
            <PencilFill /> Edit
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

HorseCard.propTypes = {
  aHorseCard: PropTypes.shape({
    id: PropTypes.number.isRequired,
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
      id: PropTypes.number.isRequired,
      city: PropTypes.string.isRequired,
      lineOne: PropTypes.string.isRequired,
      lineTwo: PropTypes.string.isRequired,
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
};

export default HorseCard;
