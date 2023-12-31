import React, { useState } from "react";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';

import { useNavigate, Navigate, Link } from "react-router-dom";
import { loginRequest } from '../axios/apiCalls';
import { useDispatch } from "react-redux";
import { reducerUserLogin } from "../redux/userRedux";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Login() {
  const [alertMessage, setAlertMessage] = useState(""); // Mensagem;
  const [showAlertMessage, setShowAlertMessage] = useState(false); // Exibir ou não;
  const [typeAlertMessage, setTypeAlertMessage] = useState(''); // Tipo da mensagem: success, error, warning ou info;
  // Alert message for login
  const handleAlertMessage = (type, message) => {
      setShowAlertMessage(true);
      setAlertMessage(message);
      setTypeAlertMessage(type);
      setTimeout(() => { setShowAlertMessage(false) }, 7000); // Fechar a mensagem;
  };

  const navigate = useNavigate();

  const dispatchLogin = useDispatch();
  /**
   * Executes the onFinish function when form values are submitted.
   *
   * @param {object} values - The values submitted from the form.
   * User Login function
   */
  const onFinish = (values) => {
    loginRequest(values).then(response => {
      if(response.status == 200) {
        dispatchLogin(reducerUserLogin(response.data));
        handleAlertMessage("success", "Usuário logado com sucesso!");
        navigate("/home")
       } else {
        handleAlertMessage("error", "Algo de errado aconteceu com a sua tentativa de login.");
      }
    })  
  };

  return (
    <div className="bg-white">
      <Form
        name="normal_login"
        style={{ marginTop: '160px'}}
        className="flex flex-col justify-center items-center align-middle"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        >
        <img src="./logo.png" className="mb-5" style={{width: '200px'}} alt="" />
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Por favor digita seu username!',
            },
          ]}
        >
          <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Digite seu username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
          {
              required: true,
              message: 'Por favor insira uma senha!',
              min: 6
          },
          ]}
        >   
          <Input.Password placeholder="Digite sua senha" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Login
          </Button>
          &nbsp; ou <Link to="/register"> Registrar </Link>
          
        </Form.Item>
      </Form>
      <Snackbar
        open={showAlertMessage}
        severity="success"
        TransitionComponent={SlideTransition}
        anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
        }}>
        <Alert  severity={typeAlertMessage} sx={{ width: '100%' }}>
        {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  )
};
