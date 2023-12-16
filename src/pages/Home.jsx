import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { editUserInformation, getUser, createRelation, createPost} from "../axios/apiCalls"
import { Table } from "antd";
import { Card, Col, Row } from 'antd';
import { Input, Flex, Button, Tabs, Modal, Form, Divider, Empty } from 'antd';
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import UserGraphComponent from './components/UserGraphComponent';
import { useLocation, Link } from "react-router-dom";

import Header from './components/Header';
import Footer from './components/Footer';


import moment from 'moment';
import 'moment/dist/locale/pt-br'
moment.locale('pt-br');

import { Switch, Typography } from 'antd';
const { Paragraph, Text } = Typography;

const { TextArea } = Input;

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}




export default function Home() {
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

    const location = useLocation();
    
    const dbUser = useSelector((state) => state.user.currentUser);
    const currentUser = location.pathname.split("/perfil/")[1];
    
    const username2 = location.pathname.split("/perfil/")[1];
    if (username2 == dbUser.username) {
        window.location.href = "/home";
    }


    const [user, setUserData] = useState();    

    useEffect(() => {
        const userToGetData = currentUser === undefined ? dbUser.username : currentUser;
        getUser(userToGetData).then(response => {
            if(response.status === 200) {
                setUserData(response.data)
            } else {
                window.location.href = "/home"
            }
        })
    }, [currentUser, dbUser.username])
    
    useEffect(() => {
        if (user) {
            sanitizeUserData(user);
        }
    }, [user]);
    
    const [followingDataSource , setFollowingDataSource] = useState([]);
    const [followersDataSource , setFollowersDataSource] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    
    // Sanitize extracted data  
    const sanitizeUserData = (data) => {
        var following = []
        var followers = []
        if (data.connections.following !== undefined) {
            data.connections.following.map(f => {
                following.push({following: 
                    <Link to={`/perfil/${f}`} className="flex justify-center items-center gap-4">
                        {f}
                    </Link>
                })
            })
        }
        if (data.connections.followers !== undefined) {
            data.connections.followers.map(f => {
                followers.push({followers: 
                    <a href={`/perfil/${f}`} className="flex justify-center items-center gap-4">
                        {f}
                    </a>
                    })
            })
        }
        setFollowingDataSource(following)
        setFollowersDataSource(followers)
        
        if (data.connections.followers !== undefined) {
            setIsFollowing(data.connections.followers.includes(dbUser.username))
        }
        setEditNameValue(data.info.name)
    }

    const userFollowingColumn = [{title: 'Seguindo', dataIndex: 'following', key: 'following'}]
    const userFollowersColumn = [{title: 'Seguidores', dataIndex: 'followers', key: 'followers'}]


    const addRelation = (type) => {
        if(type == "follow") {
            createRelation({username1: dbUser.username, username2: user.info.username}).then( response => {
                if(response.status == 200) {
                    setIsFollowing(true)
                    getUser(user.info.username).then(response => {
                        if(response.status === 200) {
                            setUserData(response.data)
                        } else {
                            window.location.href = "/home"
                        }
                    })
                }
            })
        }
    }

    const [loadings, setLoadings] = useState([]);
    const enterLoading = (index) => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
    });
      setTimeout(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
    }, 500);
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    }
    
    const [TextAreaValue, setTextAreaValue] = useState("");
    const handleTextAreaChange = (e) => {
        e.preventDefault();
        setTextAreaValue(e.target.value);
    }

    const [EditNameValue, setEditNameValue] = useState("");
    const handleEditNameChange = (e) => {
        e.preventDefault()
        setEditNameValue(e.target.value)
    }

    const editUser = () => {
        if (EditNameValue.length < 2) {
            handleAlertMessage("warning", "Nome muito curto")
            return
        }
        console.log({username: user.info.username, name: EditNameValue, bio: TextAreaValue})
        const infos = {
            username: user.info.username,
            info: {
                name: EditNameValue,
                bio: TextAreaValue
            }
        }
        editUserInformation(infos).then(response => {
            if(response.status == 200) {
                setOpen(false);
                window.location.reload()
            } else {
                console.log(response)
            }
        })
    }

    const [PostAreaValue, setPostAreaValue] = useState("");
    const handlePostAreaChange = (e) => {
        e.preventDefault();
        setPostAreaValue(e.target.value);
    }

    const addPost = (username1, username2) => {
        if (PostAreaValue.length < 2) {
            handleAlertMessage("warning", "Conteudo muito curto")
            return
        }
        createPost({username1: username1, username2: username2, text: PostAreaValue}).then( response => {
            if(response.status == 200) {
                getUser(username2).then(response => {
                    if(response.status === 200) {
                        setUserData(response.data)
                    } else {
                        window.location.href = "/home"
                    }
                })
            }
        })
    }

    return (
        <>
          {user !== undefined && user !== null ? (
            <div className="flex flex-col bg-bg-color">
                <Header />
                <div className="flex min-h-full">
                    {/* Conteúdo do lado esquerdo (25%) */}
                    <div className="w-2/7 p-10">
                        <div className="">
                            <Card bordered={true} className="flex shadow-lg flex-col justify-center" title="Informações" style={{ width: 300 }}>
                                <div className="flex flex-col justify-center align-center gap-1">
                                    <p className="font-bold">{user.info.name}</p>
                                    <p className="mb-1 color-gray">@{user.info.username}</p>
                                    <Text>
                                        Bio: {user.info.bio}
                                    </Text>
                                </div>
                                {currentUser !== undefined ? (
                                    <Button className="ml-12 w-1/2 mt-4" type="primary" style={{ backgroundColor: isFollowing ? 'green' : '' }} loading={loadings[0]} 
                                        onClick={() => {
                                            if (!isFollowing) {
                                                enterLoading(0)
                                                addRelation("follow")
                                            }
                                            }}>
                                        {isFollowing ? "Seguindo" : "Seguir"}
                                    </Button>
                                ): (
                                    <Button className="ml-12 w-1/2 mt-4" type="primary" style={{ backgroundColor: isFollowing ? 'green' : '' }} loading={loadings[0]} 
                                        onClick={handleOpen} 
                                    >
                                        Editar perfil
                                    </Button>
                                )}
                            </Card>
                        </div>
                        <div className="mt-5">
                            <Card className="shadow-lg flex flex-col justify-center shado" title="Grafo centrado no usuário" bordered={true} style={{ width: 300 }}>
                                <UserGraphComponent user={user.info} render={isFollowing} />
                                <Button className="ml-8  mt-4" type="primary">
                                    <Link to={`/social-network`}>
                                        Ver o grafo completo
                                    </Link>
                                </Button>
                            </Card> 
                        </div>
                    </div>
                    <div className="w-2/3 p-10 flex flex-col gap-10">
                        <div className="h-1/4 flex flex-col gap-4" style={{marginBottom: '0px'}}>
                            <TextArea
                                className="shadow-lg"
                                showCount
                                maxLength={200}
                                onChange={handlePostAreaChange}
                                placeholder="Faça sua publicação..."
                                style={{
                                    height: 120,
                                    resize: 'none',
                                }}
                            />
                            {currentUser !== undefined ? (
                                <Button onClick={() => (addPost(dbUser.username, user.info.username ))} className="w-52" type="primary" >
                                    <p>
                                        Publicar no mural de {user.info.name.split(" ")[0]}
                                    </p>
                                </Button>
                            ) : (
                                <Button className="w-1/6" type="primary" onClick={() => (addPost(user.info.username, user.info.username ))} >
                                    Publicar
                                </Button>
                            )}
                        </div>
                        <div style={{maxHeight: '600px', marginTop: currentUser !== undefined ? '0px' : '-80px'}} className="bg-white h-full shadow-lg rounded-lg flex flex-col items-center px-10 overflow-y-scroll">
                            {user.info.mural.length === 0 ? (<Empty style={{marginTop: '180px'}} description="Parece que seu mural está vazio..." />) : (
                                <div className='mt-9'>
                                    {user.info.mural.map((post) => (
                                        <div className='flex flex-col' style={{width: '400px'}}> 
                                            <div className='flex flex-col mb-5'> 
                                                <div className="flex justify-between">
                                                    <div style={{fontWeight: 'bold', fontSize: '20px'}}>
                                                        {post.username} falou:
                                                    </div>
                                                    {moment(post.createdAt).fromNow()}
                                                </div>
                                                <Text className='mt-2'>
                                                    {post.text}
                                                </Text>
                                            </div>
                                            <Divider />
                                        </div>
                                    ))}   
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-1/4 p-10">
                    {/* Conteúdo do lado direito (25%) */}
                        <div className="shadow-lg">
                            <Table  locale={{emptyText: 'Você ainda não segue ninguem'}}  bordered className="shadow-lg rounded" pagination={false} dataSource={followingDataSource} columns={userFollowingColumn} />
                        </div>
                        <div className="mt-5 shadow-lg">                        
                            <Table locale={{emptyText: 'Você ainda não possui seguidores'}} bordered className="shadow-lg rounded" pagination={false} dataSource={followersDataSource} columns={userFollowersColumn} />
                        </div>
                        <div className="mt-5 shadow-lg">
                            <Card title="Fundadores"> 
                                <div className="flex justify-center items-center flex-col" style={{fontSize: '18px'}}>
                                    <a href={`/perfil/clarossa`} className="flex justify-center items-center gap-4">
                                        <img style={{borderRadius: '50%'}} className="w-12 h-12" src="https://cdn.discordapp.com/attachments/993609673548767242/1185657788135915641/IY0SQNxR_400x400.png?ex=659068dd&is=657df3dd&hm=b4ae23b6b1fb2998acf310d7db9c6339030f06225feaf3c0d1882e09bbd7111c&" alt="" />
                                        Clarisse Estima
                                    </a>
                                    <Divider/>
                                    <a href={`/perfil/endriys`} className="flex justify-center items-center gap-4">
                                        <img style={{borderRadius: '50%'}} className="w-12 h-12" src="https://media.discordapp.net/attachments/1051613820289822740/1185665734483922964/image.png?ex=65907043&is=657dfb43&hm=dde75d5c5462ad343c358f15e3ac5d44e45f8a371bb5e853eacf837c1b4b8072&=&format=webp&quality=lossless&width=735&height=683" alt="" />
                                        Gabriel Provin
                                    </a>
                                    <Divider/>
                                    <a href={`/perfil/n_elsner`} className="flex justify-center items-center gap-4">
                                        <img style={{borderRadius: '50%'}} className="w-12 h-12" src="https://media.discordapp.net/attachments/1051613820289822740/1185658941183643669/82481dc4-31ac-49fd-ad57-9d8d6914efcf.png?ex=659069f0&is=657df4f0&hm=b4664b993858a4d2205c659a397a88e2bd1a15728eda86b7fc55d9bf2f76c7cf&=&format=webp&quality=lossless" alt="" />
                                        Nairo Elsner
                                    </a>
                                    <Divider/>
                                    <a href={`/perfil/seven_renato`} className="flex justify-center items-center gap-4">
                                        <img style={{borderRadius: '50%'}} className="w-12 h-12" src="data:image/jpeg;base64,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"/>
                                        Paulo Renato
                                    </a>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
                <Modal
                    title="Editar informações"
                    centered
                    open={open}
                    onOk={() => editUser(EditNameValue, TextAreaValue)}
                    onCancel={() => {setOpen(false), setEditNameValue(""), setTextAreaValue("")}}
                    width={500}
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <Form>
                        <Form.Item
                            name="name"
                            rules={[
                            {
                                required: true,
                                message: 'Por favor insira o seu nome!',
                            },
                            ]}
                        >
                            <Input defaultValue={user.info.name} onChange={handleEditNameChange} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nome" />                 
                        </Form.Item>
                    </Form>
                    <TextArea
                        minLength={1}
                        showCount
                        maxLength={50}
                        onChange={handleTextAreaChange}
                        placeholder="Mude sua bio..."
                        style={{
                            height: 120,
                            resize: 'none',
                        }}
                        className="mb-10 mt-5"
                    />
                </Modal>

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

              <Footer />
            </div>
          ) : (
            "Carregando..."
          )}
        </>
    );
}
