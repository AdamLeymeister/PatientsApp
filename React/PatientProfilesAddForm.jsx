import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import FileUpload from "components/fileUpload/FileUpload";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { horseFormSchema } from "schemas/horseFormSchema";
import "../../toastr/build/toastr.css";
import toastr from "toastr";
import * as horseService from "services/horseProfilesService";
import "./patientprofile.css";
import { Card, Col, Row, Button, FormGroup } from "react-bootstrap";
import lookupService from "../../services/lookUpService";
import HorseAvatar from "./PatientAvatar";
import LocationForm from "../location/LocationForm";
const _logger = debug.extend("AddHorseForm");

function HorseProfilesAddForm() {
  const [formState, setForm] = useState({
    name: "",
    weight: "",
    age: "",
    color: "",
    primaryImageUrl: "",
    horseLocationId: 1,
    breedTypeId: 1,
    horseFiles: [],
    horseMedications: [],
  });
  const [dropDownState, setDropDownState] = useState({
    breedTypes: [],
    medications: [],
  });
  const [fileState, setFileState] = useState([]);
  const lookupTables = ["breedTypes", "medications"];
  const [horse, setHorse] = useState("");
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!dropDownState.breedTypes.length > 0) getLookupTables();
    if (id) {
      setHorse(id);
    }
    if (state) {
      if (state?.type !== "HORSE-OBJ" && state.payload) return;
      const { payload } = state;
      const { ...horseObj } = payload;
      const ns = { ...horseObj };
      if (horseObj === formState) return;
      const breedId = ns?.breedTypeId?.id;
      setForm((prevState) => {
        let newState = { ...prevState };
        newState = ns;
        newState.stateId = ns.horseLocation.state.id;
        newState.city = ns.horseLocation.city;
        newState.zip = ns.horseLocation.zip;
        newState.lineOne = ns.horseLocation.lineOne;
        newState.lineTwo = ns.horseLocation.lineTwo;
        newState.latitude = ns.horseLocation.latitude;
        newState.longitude = ns.horseLocation.longitude;
        newState.lineTwo = ns.horseLocation.lineTwo;
        newState.breedTypeId = breedId;
        newState.locationTypeId = ns.horseLocation.locationType.id;
        newState.horseFiles = [];
        newState.horseMedications = [];
        return newState;
      });
    }
  }, [horse]);
  const getLookupTables = () => {
    lookupService
      .LookUp(lookupTables)
      .then(onLookupSuccess)
      .catch(onGetPatientError);
  };
  const onLookupSuccess = (res) => {
    if (res?.item?.breedTypes) {
      const { breedTypes } = res.item;
      const { medications } = res.item;
      setDropDownState((prevState) => {
        let ns = { ...prevState };
        ns.breedTypes = breedTypes.map(mapTables);
        ns.medications = medications.map(mapTables);
        return ns;
      });
    }
  };

  const mapTables = (lookup) => {
    return { id: lookup.id, name: lookup.name };
  };
  const mapBreedDropDown = (breed) => (
    <option value={breed.id} key={`breed_${breed.id}`}>
      {breed.name}
    </option>
  );

  const mapMedicationDropDown = (med) => (
    <option value={med.id} key={`med_${med.id}`}>
      {med.name}
    </option>
  );

  const breedTypesDropDown = (errors, touched, handleChange, values) => {
    return (
      <>
        <label className="horse-label">Breed</label>
        <Field
          as="select"
          className={
            "form-select" +
            (errors.breedTypeId && touched.breedTypeId ? " is-invalid" : "")
          }
          name="breedTypeId"
          value={values.breedTypeId}
          onChange={handleChange}
        >
          {dropDownState.breedTypes.map(mapBreedDropDown)}
        </Field>
      </>
    );
  };

  const onLocationSubmit = (setFieldValue, res) => {
    setFieldValue("horseLocationId", res);
  };
  const mapHorseFiles = (values) => {
    setFileState((ps) => {
      let ns = { ...ps };
      ns = values.map(renderFiles);
      return ns;
    });
  };

  const renderFiles = (file) => {
    const urlArr = file.url.split("/");
    const fileName = urlArr[urlArr.length - 1];
    return (
      <div key={`file_${file.url}`}>
        <Row className="horsefiles-row">
          <img className="horsefiles-img" src={`${file.url}`} alt="file" />
          <p>{fileName}</p>
        </Row>
      </div>
    );
  };

  const handleSubmit = (values) => {
    if (id) {
      values.horseLocationId =
        values.horseLocationId > 0
          ? values.horseLocationId
          : formState?.horseLocation?.id;
      horseService
        .updateHorse(values)
        .then(onGetPatientSuccess)
        .catch(onGetPatientError);
    } else {
      horseService
        .addHorse(values)
        .then(onGetPatientSuccess)
        .catch(onGetPatientError);
    }
  };
  const onGetPatientSuccess = () => {
    toastr.success("Success!");
    navigate("/owner/patients");
  };

  const onGetPatientError = (err) => {
    _logger("onGetPatientError", err);
    toastr.error("There was an error!");
  };

  const onFileUploaded = (value, setFieldValue) => {
    const idArr = [];
    value.map((v) => idArr.push(v.id));
    setFieldValue("horseFiles", idArr);
    mapHorseFiles(value);
  };

  return (
    <>
      <div className="horse-addform-wrapper">
        <Col lg={12}>
          <Card>
            <Card.Body>
              {id ? (
                <h4 className="card-title">Edit Patient Profile</h4>
              ) : (
                <h4 className="card-title">Add Patient Form</h4>
              )}
              <Formik
                onSubmit={handleSubmit}
                enableReinitialize={true}
                initialValues={formState}
                validationSchema={horseFormSchema}
              >
                {({ errors, touched, setFieldValue, handleChange, values }) => (
                  <Form className="needs-validation">
                    <div className="addhorse-avatar">
                      <HorseAvatar
                        horseAvatar={formState.primaryImageUrl}
                        onUploadSuccess={(res) =>
                          setFieldValue("primaryImageUrl", res[0].url)
                        }
                      />
                    </div>
                    <div className="form-control mt-2 mb-3">
                      <Row>
                        <div className="pt-1 text-start">
                          <h2>Horse Information</h2>
                        </div>
                        <Col md="6">
                          <FormGroup className="horse-input">
                            <label className="horse-label">Name</label>
                            <Field
                              name="name"
                              type="text"
                              className={
                                "form-control" +
                                (errors.name && touched.name
                                  ? " is-invalid"
                                  : "")
                              }
                              placeholder="Enter Name"
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="invalid-feedback"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup className="horse-input">
                            <label className="horse-label">Color</label>
                            <Field
                              name="color"
                              placeholder="Color"
                              type="text"
                              className={
                                "form-control" +
                                (errors.color && touched.color
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="color"
                              component="div"
                              className="invalid-feedback"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <FormGroup className="horse-input">
                            <label className="horse-label">Weight</label>
                            <Field
                              name="weight"
                              placeholder="Weight"
                              type="number"
                              className={
                                "form-control" +
                                (errors.weight && touched.weight
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="weight"
                              component="div"
                              className="invalid-feedback"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup className="horse-input">
                            <label className="horse-label">Age</label>
                            <Field
                              name="age"
                              placeholder="Age"
                              type="number"
                              className={
                                "form-control" +
                                (errors.age && touched.age ? " is-invalid" : "")
                              }
                            />
                            <ErrorMessage
                              name="age"
                              component="div"
                              className="invalid-feedback"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup className="mb-3">
                            <div className="mb-3 horse-input">
                              {breedTypesDropDown(
                                errors,
                                touched,
                                handleChange,
                                values
                              )}
                              <ErrorMessage
                                name="breedTypeId"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <div className="form-control">
                        <div className="text-start">
                          <h2>Location</h2>
                        </div>
                        <LocationForm
                          formData={formState}
                          hasFormSubmit={true}
                          isLatLongHidden={true}
                          returnLocationId={(res) =>
                            onLocationSubmit(setFieldValue, res)
                          }
                        ></LocationForm>
                      </div>

                      <Row>
                        <FieldArray name="horseMedications">
                          {({ push, remove, form }) => {
                            const horseMedications =
                              form.values.horseMedications;
                            return (
                              <FormGroup className="mb-3 mt-3 horse-input form-control">
                                <div className="mb-3">
                                  <label className="horse-label">
                                    <h2>Medications</h2>
                                  </label>
                                  {horseMedications.map(
                                    (horseMedication, index) => (
                                      <div
                                        className="horse-medications"
                                        key={index}
                                      >
                                        <Field
                                          className="form-control"
                                          name={`horseMedications[${index}].id`}
                                          as="select"
                                        >
                                          {dropDownState?.medications.map(
                                            mapMedicationDropDown
                                          )}
                                        </Field>
                                        <Field
                                          name={`horseMedications[${index}].dosage`}
                                          placeholder="Dosage"
                                          type="number"
                                          className={
                                            "form-control" +
                                            (errors.lineOne && touched.lineOne
                                              ? " is-invalid"
                                              : "")
                                          }
                                        />
                                        <ErrorMessage
                                          name="lineOne"
                                          component="div"
                                          className="invalid-feedback"
                                        />
                                        <Field
                                          name={`horseMedications[${index}].dosageUnit`}
                                          placeholder="Unit"
                                          type="text"
                                          className={
                                            "form-control" +
                                            (errors.lineOne && touched.lineOne
                                              ? " is-invalid"
                                              : "")
                                          }
                                        />
                                        <ErrorMessage
                                          name="lineOne"
                                          component="div"
                                          className="invalid-feedback"
                                        />
                                        <Field
                                          name={`horseMedications[${index}].frequency`}
                                          placeholder="Frequency"
                                          type="text"
                                          className={
                                            "form-control" +
                                            (errors.lineOne && touched.lineOne
                                              ? " is-invalid"
                                              : "")
                                          }
                                        />
                                        <ErrorMessage
                                          name="lineOne"
                                          component="div"
                                          className="invalid-feedback"
                                        />
                                        <Field
                                          name={`horseMedications[${index}].numberDoses`}
                                          placeholder="Doses"
                                          type="number"
                                          className={
                                            "form-control" +
                                            (errors.lineOne && touched.lineOne
                                              ? " is-invalid"
                                              : "")
                                          }
                                        />
                                        <ErrorMessage
                                          name="lineOne"
                                          component="div"
                                          className="invalid-feedback"
                                        />
                                        <Field
                                          name={`horseMedications[${index}].startDate`}
                                          placeholder="Start Date"
                                          type="date"
                                          className={
                                            "form-control" +
                                            (errors.lineOne && touched.lineOne
                                              ? " is-invalid"
                                              : "")
                                          }
                                        />
                                        <ErrorMessage
                                          name="lineOne"
                                          component="div"
                                          className="invalid-feedback"
                                        />

                                        <Button onClick={() => remove(index)}>
                                          -
                                        </Button>
                                      </div>
                                    )
                                  )}
                                  <ErrorMessage
                                    name="medications"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                                <Button
                                  className="btn btn-primary"
                                  onClick={() => push()}
                                >
                                  Add Medication
                                </Button>
                              </FormGroup>
                            );
                          }}
                        </FieldArray>
                      </Row>

                      <Col>
                        <div className="horsefiles-container">{fileState}</div>
                        <FileUpload
                          onUploadSuccess={(file) =>
                            onFileUploaded(file, setFieldValue)
                          }
                        />
                      </Col>
                    </div>
                    <Row>
                      <Col lg="12"></Col>
                    </Row>
                    <Button className="mt-2" color="primary" type="submit">
                      Submit Form
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </div>
    </>
  );
}
export default HorseProfilesAddForm;
