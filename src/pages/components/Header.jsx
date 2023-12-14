import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Link } from "react-router-dom";

import { searchUser} from "../../axios/apiCalls";
import { Input } from 'antd';
const { Search } = Input;

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
        <div className='flex bg-beeyellow h-20 text-white px-4 '>
                <div className='flex gap-10 w-2/3'>
                    <div className="flex flex-col justify-center items-center text-4xl ">
                        <Link to={`/home`}>
                            <img className="mt-2 w-20 h-20" src="../../../public/logo.png" alt="" />
                        </Link>
                    </div>
                    <div className="flex flex-col justify-center items-center text-4xl">
                        <Link to={`/social-network`}>
                            Social Network Graph
                        </Link>
                    </div>
                </div>
                <div className='w-1/3 flex justify-end gap-4 items-center'>
                    <div className="w-3/4">
                        <Search className="" placeholder="Buscar por usuário" enterButton="Buscar" size="large" onSearch={onSearch}/>
                        {!searched ? (<span></span>) : (
                        <>
                            <div className="flex flex-col justify-center items-center mt-1">
                                {foundUsers.map((item, index) => (
                                    <div className="mb-2" key={index}>
                                        <a href={`/perfil/${item}`} key={index}>
                                            {item}
                                        </a>
                                        <br></br>
                                    </div>
                                ))}
                            </div>
                        </>)}
                    </div>
                    <div className='w-1/4 flex flex-col items-center'>
                        <p className="" onMouseOver={() => (setLogoutUserInformation(true))}>
                            Olá, {user.username}!
                        </p>
                        {logoutUserInformation && (
                            <div className='absolute bg-midnightblue mt-7 px-10 py-2 rounded z-10 flex flex-col justify-center items center'>
                                <div>Perfil</div>
                                <div>Sair</div>
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
};

export default Header;

