/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { GetAuthenticatedUser, validateEmail, checkNameLength, checkName } from 'requests/requests'
import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

const Profile = () => {

  // React History Hook
  const history = useHistory();

  // React States
  const [user, setUser] = useState(null);
  const [emailState, setEmailState] = useState({ name: '', error: false, error_message: ''});
  const [firstNameState, setFirstNameState] = useState({ name: '', error: false, error_message: ''});
  const [lastNameState, setLastNameState] = useState({ name: '', error: false, error_message: ''});
  const [aboutMeState, setAboutMeState] = useState({ name: '', error: false, error_message: ''});
  const [cityState, setCityState] = useState({ name: '', error: false, error_message: ''});
  const [countryState, setCountryState] = useState({ name: '', error: false, error_message: ''});
  const [apiTokenBtnText, setApiTokenBtnText] = useState('Copy to clipboard');
  const [aboutMeLength, setAboutMeLength] = useState(0);
  const [apiTokenText, setApiTokenText] = useState('');

  // React Reference Hooks
  const apiTextRef = useRef();


  // Use Effect Hooks

  useEffect(() => {
    if (validateEmail(emailState.name) == true) {
      setEmailState((prevState) => ({ ...prevState , error: false}));
    }else{
      setEmailState((prevState) => ({ ...prevState , error_message: "Email format is invalid" , error: true}));
    }

  }, [emailState.name]);

  useEffect(() => {
      
    if (checkName(firstNameState.name) == false) {
      setFirstNameState((prevState) => ({ ...prevState , error_message: "The name has to contain alphabetic character from a-Z" , error: true}));
    }else{
      if (firstNameState.name.length !== 0) {
        if (checkNameLength(firstNameState.name) == true) {
          setFirstNameState((prevState) => ({ ...prevState , error: false}));
        }else{
          setFirstNameState((prevState) => ({ ...prevState , error_message: "The name length has to be between 10 and 30" , error: true}));
        }
      }else{
        setFirstNameState((prevState) => ({ ...prevState , error_message: "The name length has to be between 10 and 30" , error: true}));
      }
    }

  }, [firstNameState.name]);

  useEffect(() => {
      
    if (checkName(lastNameState.name) == false) {
      setLastNameState((prevState) => ({ ...prevState , error_message: "The name has to contain alphabetic character from a-Z" , error: true}));
    }else{
      if (lastNameState.name.length !== 0) {
        if (checkNameLength(lastNameState.name) == true) {
          setLastNameState((prevState) => ({ ...prevState , error: false}));
        }else{
          setLastNameState((prevState) => ({ ...prevState , error_message: "The name length has to be between 10 and 30" , error: true}));
        }
      }else{
        setLastNameState((prevState) => ({ ...prevState , error_message: "The name length has to be between 10 and 30" , error: true}));
      }
    }

  }, [lastNameState.name]);

  useEffect(() => {
    if (aboutMeLength >= 200) {
      setAboutMeState((prevState) => ({...prevState, error: true, error_message: 'Maximum number of characters exceeded'}));
    }else{
      setAboutMeState((prevState) => ({...prevState, error: false}));
    }
  }, [aboutMeLength]);

  useEffect(() => {
    if (checkName(cityState.name) == false) {
      if (cityState.name.valueOf()) {
        setCityState((prevState) => ({ ...prevState , error_message: "The name has to contain alphabetic character from a-Z" , error: true}));
      }else{
        setCityState((prevState) => ({ ...prevState , error: false}));
      }
    }else{
      setCityState((prevState) => ({ ...prevState , error: false}));
    }
  }, [cityState]);

  useEffect(() => {
    if (checkName(countryState.name) == false) {
      if (countryState.name.valueOf()) {
        setCountryState((prevState) => ({ ...prevState , error_message: "The name has to contain alphabetic character from a-Z" , error: true}));
      }else{
        setCountryState((prevState) => ({ ...prevState , error: false}));
      }
    }else{
      setCountryState((prevState) => ({ ...prevState , error: false}));
    }
  }, [countryState]);


  useEffect(() => {

    async function RedirectIfUserIsAuthenticated() {

      let user_is_authenticated = await GetAuthenticatedUser();
      if (JSON.parse(user_is_authenticated).error === true) {
        history.push('/auth/index');
        return;
      }

        // User Data
        const user = user_is_authenticated;
        const user_data = JSON.parse(JSON.parse(user).message);
        const user_error = JSON.parse(JSON.parse(user).error);
        const user_object = { data: user_data, error: user_error };

        await setUser(user_object);
        await setEmailState({ name: user_object.data.username, error: false, error_message: ''});
        await setFirstNameState({ name: user_object.data.firstname, error: false, error_message: ''});
        await setLastNameState({ name: user_object.data.lastname, error: false, error_message: ''});
        await setAboutMeState({ name: user_object.data.description, error: false, error_message: ''});
        await setApiTokenText(user_object.data.api_token);
    }

    RedirectIfUserIsAuthenticated();
  }, []);

  // Functions 
  
  function copyToClipboard(e) {
    navigator.clipboard.writeText(apiTextRef.current.props.value);
    setApiTokenBtnText('Copied');
    setTimeout(() => {
      setApiTokenBtnText('Copy to clipboard');
    }, 2000);
  }

  function emailChange(e) {
    setEmailState((prevState) => ({ ...prevState, name: e.target.value }));
  }

  function firstNameChange(e) {
    setFirstNameState((prevState) => ({...prevState, name: e.target.value}));
  }

  function lastNameChange(e) {
    setLastNameState((prevState) => ({...prevState, name: e.target.value}));
  }

  function aboutMeChange(e) {
    setAboutMeLength(e.target.value.length);
    setAboutMeState(e.target.value);
  }

  function cityChange(e) {
    setCityState((prevState) => ({...prevState, name: e.target.value}))
  }

  function countryChange(e) {
    setCountryState((prevState) => ({...prevState, name: e.target.value}))
  }

  return (
    <>
      <UserHeader user={user} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("../../assets/img/theme/team-4-800x800.jpg")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="float-right"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Message
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">22</span>
                        <span className="description">Models</span>
                      </div>
                      <div>
                        <span className="heading">10</span>
                        <span className="description">Followers</span>
                      </div>
                      <div>
                        <span className="heading">89</span>
                        <span className="description">Downloads</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                  { user ? user.data.firstname : null } { user ? user.data.lastname : "" }
                    <span className="font-weight-light">, 27</span>
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    Bucharest, Romania
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    University of Computer Science
                  </div>
                  <hr className="my-4" />
                  <p>
                     A few words about you ...
                  </p>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    Show more
                  </a>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="info"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          { emailState.error === true ? 
                              <div className="text-muted">
                                <small>
                                  <span className="text-danger font-weight-700">{emailState.error_message}</span>
                                </small>
                              </div>
                              :
                              null
                          }
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Your email address"
                            value={emailState.name}
                            onChange={emailChange}
                            id="input-email"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                        { firstNameState.error === true ? 
                              <div className="text-muted">
                                <small>
                                  <span className="text-danger font-weight-700">{firstNameState.error_message}</span>
                                </small>
                              </div>
                              :
                              null
                        }
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            placeholder="Your first name"
                            value={firstNameState.name}
                            onChange={firstNameChange}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                        { lastNameState.error === true ? 
                              <div className="text-muted">
                                <small>
                                  <span className="text-danger font-weight-700">{lastNameState.error_message}</span>
                                </small>
                              </div>
                              :
                              null
                        }
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-last-name"
                            placeholder="Your last name"
                            value={lastNameState.name}
                            onChange={lastNameChange}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                        { cityState.error === true ? 
                              <div className="text-muted">
                                <small>
                                  <span className="text-danger font-weight-700">{cityState.error_message}</span>
                                </small>
                              </div>
                              :
                              null
                          }
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            City
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-city"
                            placeholder="Your city"
                            onChange={cityChange}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                        { countryState.error === true ? 
                              <div className="text-muted">
                                <small>
                                  <span className="text-danger font-weight-700">{countryState.error_message}</span>
                                </small>
                              </div>
                              :
                              null
                        }
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Country
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-country"
                            placeholder="Your country"
                            onChange={countryChange}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                    { aboutMeState.error === true ? 
                              <div className="text-muted">
                                <small>
                                  <span className="text-danger font-weight-700">{aboutMeState.error_message}</span>
                                </small>
                              </div>
                              :
                              null
                          }
                      <label>About Me <span className={aboutMeLength >= 200 ? "text-danger font-weight-light" : "font-weight-light"}>, {aboutMeLength} / 200</span></label>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words about you ..."
                        value={aboutMeState.name}
                        onChange={aboutMeChange}
                        rows="4"       
                        type="textarea"
                      />
                    </FormGroup>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">API Token</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>Token</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="Your API Token"
                        value={apiTokenText}
                        rows="4"
                        disabled={true}
                        ref={apiTextRef}
                        type="text"
                      />
                      <br/>
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                      Generate API Key
                     </Button>
                     <Button
                        color="primary"
                        onClick={copyToClipboard}
                        size="sm"
                      >
                      {apiTokenBtnText}
                     </Button>
                    </FormGroup>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
