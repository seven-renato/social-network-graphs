import React from 'react';
import { useState } from 'react';

import { FormOutlined, MailOutlined, UserOutlined, CalendarOutlined, ExclamationOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';

import { Link } from 'react-router-dom';
import { registerRequest } from '../axios/apiCalls';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}


export default function Register() {
    const [alertMessage, setAlertMessage] = useState(""); // Mensagem;
    const [showAlertMessage, setShowAlertMessage] = useState(false); // Exibir ou não;
    const [typeAlertMessage, setTypeAlertMessage] = useState(''); // Tipo da mensagem: success, error, warning ou info;
    // Alert message for register
    const handleAlertMessage = (type, message) => {
        setShowAlertMessage(true);
        setAlertMessage(message);
        setTypeAlertMessage(type);
        setTimeout(() => { setShowAlertMessage(false) }, 7000); // Fechar a mensagem;
    };
    // Select for user type
    // Submit the form register user
    const onFinish = (values) => {
        console.log(values)
        registerRequest(values).then(response => {
            if(response.status == 200){
                handleAlertMessage("success", "Usuário criado com sucesso.");
                window.location.href = "/login";
            } else {
                handleAlertMessage("error", "Algo de errado aconteceu com a sua tentativa de cadastro.");
            }
        })
    };
    
    return (
        <div>
            <Form style={{ marginTop: '140px' }} className="mt-20 flex flex-col justify-center items-center align-middle" name="normal_login"  onFinish={onFinish}>
                 <img src="./logo.png" className="mb-5" style={{width: '200px'}} alt="" />
                <Form.Item
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Por favor insira o seu Username!',
                    },
                    ]}
                >
                    <Input size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Digite seu username" />
                </Form.Item>
                <Form.Item
                    name="name"
                    rules={[
                    {
                        required: true,
                        message: 'Por favor insira o seu nome!',
                    },
                    ]}
                >
                    <Input size='large' prefix={<FormOutlined />} placeholder="Digite seu nome" />
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
                    <Input.Password size='large' placeholder="Digite uma senha" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">Registrar</Button>
                    <span> &nbsp;Ou <Link to={'/auth/login'}>fazer login!</Link></span>
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
}