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
import { GetAuthenticatedUser } from 'requests/requests'
import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";

const Profile = () => {

  // React History Hook
  const history = useHistory();

  // React States
  const [user, setUser] = useState(null);
  const [usernameText, setUsernameText] = useState('');
  const [firstNameText, setFirstNameText] = useState('');
  const [lastNameText, setLastNameText] = useState('');
  const [aboutMeText, setAboutMeText] = useState('');
  const [apiTokenBtnText, setApiTokenBtnText] = useState('Copy to clipboard');
  const [aboutMeLength, setAboutMeLength] = useState(0);
  const [apiTokenText, setApiTokenText] = useState('');

  // React Reference Hooks
  const apiTextRef = useRef();


  // Use Effect Hooks
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
        await setUsernameText(user_object.data.username);
        await setFirstNameText(user_object.data.firstname);
        await setLastNameText(user_object.data.lastname);
        await setAboutMeText(user_object.data.description);
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

  function usernameChange(e) {
    setUsernameText(e.target.value);
  }

  function firstNameChange(e) {
    setFirstNameText(e.target.value);
  }

  function lastNameChange(e) {
    setLastNameText(e.target.value);
  }

  function aboutMeChange(e) {
    setAboutMeLength(e.target.value.length);
    setAboutMeText(e.target.value);
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
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Your email address"
                            value={usernameText}
                            onChange={usernameChange}
                            id="input-email"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
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
                            value={firstNameText}
                            onChange={firstNameChange}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
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
                            value={lastNameText}
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
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
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
                      <label>About Me <span className={aboutMeLength >= 200 ? "text-danger font-weight-light" : "font-weight-light"}>, {aboutMeLength} / 200</span></label>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words about you ..."
                        value={aboutMeText}
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
