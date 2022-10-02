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
import { 
   GetAuthenticatedUser,
   validateEmail,
   checkNameLength,
   checkName,
   checkPasswordLength,
   checkPassword
} from 'requests/requests'
import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { SpinnerCircular } from 'spinners-react'
import { SendRequest, loginUser } from "requests/requests";

const Profile = () => {

  // React History Hook
  const history = useHistory();

  // React States
  const [user, setUser] = useState(null);
  const [emailState, setEmailState] = useState({ name: '', error: false, error_message: ''});
  const [firstNameState, setFirstNameState] = useState({ name: '', error: false, error_message: ''});
  const [lastNameState, setLastNameState] = useState({ name: '', error: false, error_message: ''});
  const [aboutMeState, setAboutMeState] = useState({ name: '', error: false, error_message: ''});
  const [apiTokenBtnText, setApiTokenBtnText] = useState('Copy to clipboard');
  const [aboutMeLength, setAboutMeLength] = useState(0);
  const [apiTokenText, setApiTokenText] = useState({ text: '', value: ''});
  const [showSpinnerState, setShowSpinnerState] = useState(false);
  const [passStrengthState, setPassStrengthState] = useState('Very Weak');
  const [passwordErrorState, setPasswordError] = useState({ message: '', error: false });
  const [currentPassState, setCurrentPassState] = useState({ text: '', error: false, error_text: ''});
  const [firstPassState, setFirstPassState] = useState('');
  const [secPassState, setSecPassState] = useState('');
  const [saveButtonState, setSaveButtonState] = useState({ message: '', error: false });
  const [formState, setFormState] = useState({ message: '', valid: false });
  const [image, setImage] = useState();

  // React Reference Hooks
  const apiTextRef = useRef();


  // Use Effect Hooks

  useEffect(() => {
    if (firstNameState.error === false && lastNameState.error === false && passwordErrorState.error === false && aboutMeState.error === false) {
      setSaveButtonState({ error: false });
    }else{
      setSaveButtonState({ message: 'One of the fields are wrong', error: true });
    }
  }, [firstNameState.error, lastNameState.error, passwordErrorState.error, aboutMeState.error]);

  useEffect(() => {
    if (validateEmail(emailState.name) == true) {
      setEmailState((prevState) => ({ ...prevState , error: false}));
    }else{
      setEmailState((prevState) => ({ ...prevState , error_message: "Email format is invalid" , error: true}));
    }

  }, [emailState.name]);

   // Password Checker
   useEffect(() => {

    if (!currentPassState.text.valueOf()) {
      setPasswordError({ message: 'Current Password is empty', error: true });
      return;
    }else{
      setPasswordError({ message: 'Current Password is ok', error: false });
    }

    if (currentPassState.error === true) {
      setPasswordError({ message: "The current password is wrong" , error: true});
    }else{
      if (firstPassState.length !== 0 || secPassState.length !== 0) {
        if (firstPassState.valueOf() === secPassState.valueOf()) {
          if (checkPasswordLength(firstPassState) == true) {
            setPasswordError({ message: '', error: false });
            setPassStrengthState(checkPassword(firstPassState))   
          }else{
            setPasswordError({ message: 'The password length has to be between 10 and 30' , error: true });
          }
        }else{
          setPasswordError({ message: 'Passwords don\'t match', error: true });
        }
      }else{
        setPasswordError({ message: '', error: false });
      }
    }
  }, [firstPassState, secPassState, currentPassState.text]);

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
        await setAboutMeLength(aboutMeState.name.length);
        await setApiTokenText({ text: user_object.data.api_token, value: user_object.data.api_token });
    }

    RedirectIfUserIsAuthenticated();
  }, [emailState.name]);

  // Functions 

  async function generateApiToken(e) {
    let api_token = await SendRequest('http://localhost:5000/auth/generatetoken', 'GET');
    let api_token_data = await api_token.text();
    await setApiTokenText({ text: JSON.parse(api_token_data).token, value: JSON.parse(api_token_data).token });
  }
  
  function copyToClipboard(e) {
    navigator.clipboard.writeText(apiTextRef.current.props.value);
    setApiTokenBtnText('Copied');
    setTimeout(() => {
      setApiTokenBtnText('Copy to clipboard');
    }, 2000);
  }

  function firstNameChange(e) {
    setFirstNameState((prevState) => ({...prevState, name: e.target.value}));
  }

  function lastNameChange(e) {
    setLastNameState((prevState) => ({...prevState, name: e.target.value}));
  }

  function aboutMeChange(e) {
    setAboutMeLength(e.target.value.length);
    setAboutMeState({ name: e.target.value, error: false, error_message: '' });
  }

  async function saveUser(e) {

    setShowSpinnerState(true);

    const email = emailState.name;
    const firstName = firstNameState.name;
    const lastName = lastNameState.name;
    const aboutMe = aboutMeState.name;
    const apiToken = apiTokenText.value;

    let passwords_equal = await SendRequest('http://localhost:5000/auth/passwordsequal', 'POST', {
      password: currentPassState.text
    });

    let passwords_equal_data = await passwords_equal.text();

    if (JSON.parse(passwords_equal_data).error === false) {

        // Save password if new passwords have been entered

      if (firstPassState.valueOf() && secPassState.valueOf()) {

        let new_old_passwords_equal = await SendRequest('http://localhost:5000/auth/passwordsequal', 'POST', {
            password: firstPassState.valueOf()
          });

          let new_old_passwords_equal_data = await new_old_passwords_equal.text(); 

          if (JSON.parse(new_old_passwords_equal_data).error === false) {
            setPasswordError({ message: 'New password can\'t be equal to the current one' , error: true});
            return;
          }

          setPasswordError({ message: 'Password successfully submitted' , error: false});

          
      }

      // Save the form

      const save_user_body = {

        email: email,
        firstName: firstName,
        lastName: lastName,
        aboutMe: aboutMe,
        apiToken: apiToken,
        password: !firstPassState.valueOf() ? currentPassState.text : firstPassState

      };

      let save_user = await SendRequest('http://localhost:5000/auth/saveprofile', 'POST', save_user_body);

      let save_user_data = await save_user.text();

      await setFormState({ message: JSON.parse(save_user_data).message, valid: true });

      // Re-authenticate user with a freshly retrieved data
      
      await loginUser(email, save_user_body.password);
      
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

    }else{
      await setFormState({ message: 'Current password is wrong', valid: false });
    }

    setShowSpinnerState(false);
  }

  function currentPasswordChange(e) {
    setCurrentPassState((prevState) => ({ ...prevState, text: e.target.value}));
  }

  function firstPasswordChange(e) {
    setFirstPassState(e.target.value);
  }

  function secondPasswordChange(e) {
    setSecPassState(e.target.value);
  }


  function imgSelectHandler(e) {

    if (e.target.files.length !== 0) {
      setImage(e.target.files[0]);
    }
    
  }

  function uploadImage(e) {

    document.getElementById('selectFile').click();

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
                    <a onClick={(e) => e.preventDefault()}>
                      <img
                        width={200}
                        height={200}
                        alt="..."
                        className="rounded-circle"
                        src={ image ? URL.createObjectURL(image) : require("../../assets/img/theme/team-4-800x800.jpg") }
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
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Message
                  </Button>
                  <Button
                    className="float-right"
                    color="info"
                    onClick={uploadImage}
                    size="sm"
                  >
                    Change Picture
                  </Button>
                  <input id="selectFile" type="file" style={{display: "none"}} accept='.png,.jpg,.jpeg' onChange={imgSelectHandler}></input>
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
          {
            formState.valid === true 
            ?
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="text-success mb-0">Successfully saved</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User modifications have been successfully saved
                    </h6>
                  </Form>
                </CardBody>
              </Card>
            :
            formState.valid === false && formState.message.valueOf()
            ?
            <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="text-danger mb-0">Submission Failed</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      {formState.message}
                    </h6>
                  </Form>
                </CardBody>
              </Card>
            : 
            null
          }
          <br/>
            <Card className="bg-secondary shadow">
                      <CardHeader className="bg-white border-0">
                        <Row className="align-items-center">
                          <Col xs="8">
                            <h3 className="mb-0">My account</h3>
                          </Col>
                          <Col className="text-right" xs="4">
                            <Button
                              color="info"
                              onClick={saveUser}
                              disabled={saveButtonState.error}
                              size="sm"
                            >
                              { showSpinnerState === true 
                                ? 
                                  <SpinnerCircular size="15%" />
                                :
                                <>Save</>
                              }
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
                            Password
                          </h6>
                          <div className="pl-lg-4">
                            <Row>
                              <Col lg="4">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-country"
                                  >
                                    Current password
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-country"
                                    placeholder="Your current password"
                                    onChange={currentPasswordChange}
                                    type="password"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-country"
                                  >
                                    New password
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-country"
                                    placeholder="Your new password"
                                    onChange={firstPasswordChange}
                                    type="password"
                                  />
                                </FormGroup>
                              </Col>
                              <Col lg="4">
                                <FormGroup>
                                  <label
                                    className="form-control-label"
                                    htmlFor="input-country"
                                  >
                                    Repeat new password
                                  </label>
                                  <Input
                                    className="form-control-alternative"
                                    id="input-country"
                                    placeholder="Your new password"
                                    onChange={secondPasswordChange}
                                    type="password"
                                  />
                                </FormGroup>
                                { 
                                  passwordErrorState.error === false && passwordErrorState.message.valueOf() ?
                                  <div className="text-muted font-italic">
                                    <small>
                                      Password Strength:{" "}
                                      <span className="text-success font-weight-700">{passStrengthState}</span>
                                    </small>
                                  </div> : 
                                  <div className="text-muted font-italic">
                                    <small>
                                      <span className="text-danger font-weight-700">{passwordErrorState.message}</span>
                                    </small>
                                  </div> 
                                }
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
                                value={apiTokenText.text}
                                rows="4"
                                disabled={true}
                                ref={apiTextRef}
                                type="text"
                              />
                              <br/>
                              <Button
                                color="primary"
                                onClick={generateApiToken}
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
