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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";


import { useEffect, useState } from 'react';

import { SpinnerCircular } from 'spinners-react'

import { SendRequest, GetAuthenticatedUser } from 'requests/requests'
import { useHistory } from "react-router-dom";

const Login = () => {

  // React Hooks

  const history = useHistory();
  const [ emailState, changeEmailState ] = useState('');
  const [ passwordState, changePasswordState ] = useState('');
  const [ responseState, setResponseState ] = useState({ message: '', error: false });
  const [ showSpinnerState, setShowSpinnerState ] = useState(false);

  // Redirect user if he is authenticated. Execute on DOM Mount 1 times, [] react dependency list means this
  useEffect(() => {

    async function RedirectIfUserIsAuthenticated() {

      let user_is_authenticated = await GetAuthenticatedUser();
      if (JSON.parse(user_is_authenticated).error === false) {
        history.push('/admin/index');
      }
    }

    RedirectIfUserIsAuthenticated();
  }, []);
  

  // Business Functions

  function emailChange(e) {
    changeEmailState(e.target.value);
  }

  function passwordChange(e) {
    changePasswordState(e.target.value);
  }


  async function loginAccount(e) {

    setShowSpinnerState(true);

    let account_authentication = await SendRequest('http://localhost:5000/auth/authenticatelocal', 'POST',
    { 
      username: emailState,
      password: passwordState
        
    });
      
    let account_authentication_data = await account_authentication.text();
  
    setResponseState({message: JSON.parse(account_authentication_data).message, error: JSON.parse(account_authentication_data).error});

    setShowSpinnerState(false);

    if (responseState.error === false) {
      history.push('/admin/index');
    }

  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">
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
              { responseState.error === false ? <small>Or sign in with credentials</small> : <small>{responseState.message}</small>}
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
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
                    onChange={passwordChange}
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="button" onClick={loginAccount}>
                { showSpinnerState === true 
                    ? 
                    <SpinnerCircular size="10%" />
                    :
                    <>Sign in</>
                }   
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
