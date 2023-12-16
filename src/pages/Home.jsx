import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { editUserInformation, getUser, createRelation} from "../axios/apiCalls"
import { Table } from "antd";
import { Card, Col, Row } from 'antd';
import { Input, Flex, Button, Tabs, Modal, Form } from 'antd';
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import UserGraphComponent from './components/UserGraphComponent';
import { useLocation, Link } from "react-router-dom";

import Header from './components/Header';
import Footer from './components/Footer';

import Posts from "./components/Posts"

import { Switch, Typography } from 'antd';
const { Paragraph, Text } = Typography;

const { TextArea } = Input;

const items = [
    {
      key: '1',
      label: 'Publicações',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '2',
      label: 'Mural',
      children: <Header/>,
    }
];

export default function Home() {
    const location = useLocation();
    
    const dbUser = useSelector((state) => state.user.currentUser);
    const currentUser = location.pathname.split("/perfil/")[1];
    
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
                following.push({following: f})
            })
        }
        if (data.connections.followers !== undefined) {
            data.connections.followers.map(f => {
                followers.push({followers: f})
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
            createRelation({username1: dbUser.username, username2: user.info.username, type: "follow"}).then( response => {
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

    return (
        <>
          {user !== undefined && user !== null ? (
            <div className="flex flex-col bg-bg-color">
                <Header />
                <div className="flex min-h-full">
                    {/* Conteúdo do lado esquerdo (25%) */}
                    <div className="w-2/7 p-10">
                        <div className="">
                            <Card bordered={true} className="flex shadow-lg flex-col justify-center"title="Informações" style={{ width: 300 }}>
                                <div className="flex flex-col justify-center align-center gap-1">
                                    <p className="mt-">{user.info.name}</p>
                                    <p>@{user.info.username}</p>
                                    <Text>
                                        {user.info.bio}
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
                        <div className="mt-10">
                            <Card className="shadow-lg flex flex-col justify-center shado" title="Grafo centrado no usuário" bordered={true} style={{ width: 300 }}>
                                {/* <UserGraphComponent user={user.info} render={isFollowing} /> */}
                            </Card> 
                        </div>
                    </div>
                    <div className="w-2/3 p-10 flex flex-col gap-10">
                        <div className="h-1/4">
                            <TextArea
                                className="shadow-lg"
                                showCount
                                maxLength={200}
                                onChange={handleTextAreaChange}
                                placeholder="Faça sua publicação..."
                                style={{
                                    height: 120,
                                    resize: 'none',
                                    marginBottom: "-30px"
                                }}
                            />
                        </div>
                        {currentUser !== undefined ? (
                            <Button className="w-3/6" type="primary" >
                                Publicar no mural de {user.info.name}
                            </Button>

                        ) : (
                            <Button className="w-1/6" type="primary" >
                                Publicar
                            </Button>
                        )}
                        <div className="bg-white h-full rounded-lg flex flex-col items-center px-10">
                            <Posts user={user.info}/>
                        </div>
                    </div>
                    <div className="w-1/4 p-10">
                    {/* Conteúdo do lado direito (25%) */}
                        <div>
                            <Table className="shadow-lg rounded" pagination={false} dataSource={followingDataSource} columns={userFollowingColumn} />
                        </div>
                        <div className="mt-5 shadow-lg">                        
                            <Table className="shadow-lg rounded" pagination={false} dataSource={followersDataSource} columns={userFollowersColumn} />
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
              <Footer />
            </div>
          ) : (
            "Carregando..."
          )}
        </>
    );
}
