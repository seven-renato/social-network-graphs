import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { getInfoVisibility, getUser, createRelation, changeInfoVisility} from "../axios/apiCalls"
import { Table } from "antd";
import { Card, Col, Row } from 'antd';
import { Input, Space, Select, Button } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import UserGraphComponent from './components/UserGraphComponent';
import { useLocation, Link } from "react-router-dom";

import Header from './components/Header';
import Footer from './components/Footer';

const { Search } = Input;

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
        data.connections.following.map(f => {
            following.push({following: f})
        })
        data.connections.followers.map(f => {
            followers.push({followers: f})
        })
        setFollowingDataSource(following)
        setFollowersDataSource(followers)
        
        setIsFollowing(data.connections.followers.includes(dbUser.username))
    }

    const userFollowingColumn = [{title: 'Following', dataIndex: 'following', key: 'following'}]
    const userFollowersColumn = [{title: 'Followers', dataIndex: 'followers', key: 'followers'}]


    const addRelation = (type) => {
        if(type == "follow") {
            createRelation({username1: dbUser.username, username2: user.info.username, type: "follow"}).then( response => {
                if(response.status == 200) {
                    setIsFollowing(true)
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

    return (
        <>
          {user !== undefined && user !== null ? (
            <div className="flex flex-col">
              <Header />
              <div className="flex">
                <div className="w-1/3 p-10">
                  {/* Conteúdo do lado esquerdo (25%) */}
                    <div className="">
                        <Card bordered={true} className="flex shadow-lg flex-col justify-center"title="Informações"  style={{ width: 300 }}>
                            <div className="flex justify-center align-center gap-5">
                                <p>{user.info.name}</p>
                                -
                                <p>@{user.info.username}</p>
                            </div>
                            {currentUser !== undefined && (
                                <Button className="ml-12 w-1/2 mt-4" type="primary" style={{ backgroundColor: isFollowing ? 'green' : '' }} loading={loadings[0]} 
                                    onClick={() => {
                                        if (!isFollowing) {
                                            enterLoading(0)
                                            addRelation("follow")
                                        }
                                        }}>
                                    {isFollowing ? "Seguindo" : "Seguir"}
                                </Button>
                            )}
                        </Card>
                    </div>
                    <div className="mt-10">
                        <Card className="shadow-lg flex flex-col justify-center shado" title="Grafo centrado no usuário" bordered={true} style={{ width: 300 }}>
                            <UserGraphComponent user={user.info} />
                        </Card> 
                    </div>
                </div>
                <div className="w-1/2">
                  {/* Conteúdo principal (50%) */}
                </div>
                <div className="w-1/5 p-10">
                  {/* Conteúdo do lado direito (25%) */}
                    <div>
                        Seguindo
                        <Table dataSource={followingDataSource} columns={userFollowingColumn} />
                    </div>
                    <div>
                        Seguidores
                        <Table dataSource={followersDataSource} columns={userFollowersColumn} />
                    </div>
                </div>
              </div>
              <Footer />
            </div>
          ) : (
            "Carregando..."
          )}
        </>
    );
}
