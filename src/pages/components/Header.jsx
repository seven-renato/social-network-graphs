import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Link } from "react-router-dom";

import { searchUser} from "../../axios/apiCalls";
import { Input, Divider } from 'antd';
const { Search } = Input;

import { LogoutOutlined, UserOutlined } from "@ant-design/icons";


const Header = () => {
    const user = useSelector((state) => state.user.currentUser); // User from redux
    const [foundUsers, setFoundUsers] = useState([]);
    const [searched, setSearched] = useState(false);
    const onSearch = (value, _e, info) => {
        const data = {
            username: user.username,
            searchTerm: value
        }
        searchUser(data).then(response => {
            if(response.status == 200) {
                setFoundUsers(response.data.results)
                setSearched(true)
            }
        })
    };

    const [logoutUserInformation, setLogoutUserInformation] = useState(false)
    const handleLogoutUserInformation = () => {
        setLogoutUserInformation(true)
    }
    return (
        <div className='flex bg-color1 h-32 px-4 '>
                <div className='flex gap-10 w-2/3 text-white'>
                    <div className="flex justify-center items-center text-4xl gap-4">
                        <Link to={'/home'}>
                            <img className="mt-2 w-22 h-20 ml-10" src="../logo2.png" alt="" />
                        </Link>
                        <Link to={"/home"}>
                            <p style={{fontWeight: 'bold', fontFamily: 'Lilita One', fontSize: '60px'}}>
                                Orbee
                            </p>
                        </Link>
                    </div>
                </div>
                <div className='w-1/3 flex justify-end gap-4 items-center'>
                    <div className="w-3/4">
                        <Search className="" placeholder="Buscar por usuário" enterButton="Buscar" size="large" onSearch={onSearch} />
                        {!searched ? (
                        <span></span>
                        ) : (
                        <div className='flex justify-center' onMouseLeave={() => (setSearched(false))}>
                            <div style={{width: "325px", maxHeight: "300px"}} className="flex pt-10 z-10 absolute flex-col justify-center items-center text-black rounded-b-lg bg-white overflow-y-auto">
                                {foundUsers.map((item, index) => (
                                    <Link to={`/perfil/${item}`} className="font-bold text-lg" style={{marginTop: index == 0 ? "00px" : "10px"}}>
                                        {item}
                                        <Divider/>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        )}
                    </div>
                    <div className='w-1/4 flex flex-col items-center' style={{fontSize: "20px"}}>
                        <p className="text-white cursor-pointer" onClick={() => (setLogoutUserInformation(!logoutUserInformation))}>
                            Olá, {user.username}!
                        </p>
                        {logoutUserInformation && (
                            <div style={{width: "130px"}} className='text-white absolute bg-color2 mt-9 px-7 py-4 rounded z-10 flex flex-col justify-center items center'>
                                <a href='/home'> <UserOutlined/> Perfil</a>
                                <a href='/login'> <LogoutOutlined/> Sair</a>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
};

export default Header;

