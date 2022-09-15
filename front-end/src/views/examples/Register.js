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


import { useRef, useEffect, useState } from 'react'

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";

const Register = () => {

  const [firstNameState, setFirstNameState] = useState({ name: '', error: false, error_message: ''});
  const [lastNameState, setLastNameState] = useState({ name: '', error: false, error_message: ''});

  const [emailState, setEmailState] = useState({ name: '', error: false, error_message: ''});

  const [passStrengthState, setPassStrengthState] = useState('Very Weak')
  const [passwordError, setPasswordError] = useState({ message: "", error: false })
  const [firstPassState, setFirstPassState] = useState('')
  const [secPassState, setSecPassState] = useState('')

  // Validate Email Format
  function validateEmail(email) 
  {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
      return true;
    }
      return false;
  }

  function checkNameLength(name) {

    if (name.length < 5 || name.length > 40) {
      return false;
    }

    return true;
  }

  function checkName(name) {

    if (name.indexOf(' ') >= 0 || !name.match(/^[a-zA-Z\s]+$/i)) {
      return false;
    }
    return true;
  }
  

  function checkPasswordLength(password) {

    if (password.length < 10 || password.length > 30) {
      return false;
    }

    return true;
  }

  function checkPassword(password) {
    var strength = 0;
    if (password.match(/[a-z]+/)) {
      strength += 1;
    }
    if (password.match(/[A-Z]+/)) {
      strength += 1;
    }
    if (password.match(/[0-9]+/)) {
      strength += 1;
    }
    if (password.match(/[$@#&!]+/)) {
      strength += 1;
  
    }
  
    switch (strength) {
      case 0:
        return "Very Weak";
        break;
  
      case 1:
        return "Weak";
        break;
  
      case 2:
        return "Normal";
        break;
  
      case 3:
        return "Strong";
        break;
  
      case 4:
        return "Very Strong";
        break;
    }
  }

  // First Name
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

  // Last Name
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

  // Email
  useEffect(() => {
    if (validateEmail(emailState.name) == true) {
      setEmailState((prevState) => ({ ...prevState , error: false}));
    }else{
      setEmailState((prevState) => ({ ...prevState , error_message: "Email format is invalid" , error: true}));
    }

  }, [emailState.name]);
  
  // Password Checker
  useEffect(() => {

  
    if (firstPassState.length !== 0 || secPassState.length !== 0) {
      if (firstPassState.valueOf() == secPassState.valueOf()) {
        if (checkPasswordLength(firstPassState) == true) {
          setPasswordError({error: false});
          setPassStrengthState(checkPassword(firstPassState))   
        }else{
          setPasswordError({ message: "The password length has to be between 10 and 30" , error: true});
        }
      }else{
        setPasswordError({ message: "Passwords don't match", error: true});
      }
    }else{
      setPasswordError({ message: "The password length has to be between 10 and 30" , error: true});
    }

  }, [firstPassState, secPassState]);
  
  function firstNameChange(e) {
    setFirstNameState({ name: e.target.value });
  }

  function lastNameChange(e) {
    setLastNameState({ name: e.target.value });
  }

  function firstPasswordChange(e) {
    setFirstPassState(e.target.value);
  }

  function secondPasswordChange(e) {
    setSecPassState(e.target.value);
  }

  function emailChange(e) {
    setEmailState({ name: e.target.value});
  }

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <small>Sign up with</small>
            </div>
            <div className="text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="http://localhost:5000/auth/authenticategoogle"
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign up with credentials</small>
            </div>
            <Form role="form">
              <FormGroup>
                <div className="text-muted font-italic">
                  <small>
                    <span className="text-danger font-weight-700">{firstNameState.error_message}</span>
                  </small>
                </div>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    onChange={firstNameChange}
                    placeholder="First Name"  
                    type="text"
                   />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <div className="text-muted font-italic">
                  <small>
                    <span className="text-danger font-weight-700">{lastNameState.error_message}</span>
                  </small>
                </div>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    onChange={lastNameChange}
                    placeholder="Last Name"  
                    type="text"
                   />
                </InputGroup>
              </FormGroup>
              <FormGroup>
              <div className="text-muted font-italic">
                  <small>
                    <span className="text-danger font-weight-700">{emailState.error_message}</span>
                  </small>
                </div>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    onChange={emailChange}
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    onChange={firstPasswordChange}
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                  onChange={secondPasswordChange}
                    placeholder="Repeat Password"
                    type="password"
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              { passwordError.error == false ?
              <div className="text-muted font-italic">
                <small>
                  Password Strength:{" "}
                  <span className="text-success font-weight-700">{passStrengthState}</span>
                </small>
              </div> : 
              <div className="text-muted font-italic">
                <small>
                  <span className="text-danger font-weight-700">{passwordError.message}</span>
                </small>
              </div> }

              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="text-center">
                <Button className="mt-4" color="primary" type="button">
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
