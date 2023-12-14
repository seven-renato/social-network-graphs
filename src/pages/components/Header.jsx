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
    return (
        <div className='flex bg-blue-500 text-white px-4 py-2 lg:px-8 lg:py-4'>
                <div className='flex gap-10 w-3/4'>
                    <div className="flex flex-col justify-center items-center text-4xl ">
                        <Link to={`/home`}>
                            <img className="w-10 h-10" src="https://i0.wp.com/multarte.com.br/wp-content/uploads/2020/07/twitter_logo_whiteonimage.png?resize=400%2C400&ssl=1" alt="" />
                        </Link>
                    </div>
                    <div className="flex flex-col justify-center items-center text-4xl ">
                        <a href="/home">
                            {user.username}
                        </a>
                    </div>
                    <div className="flex flex-col justify-center items-center text-4xl">
                        <Link to={`/social-network`}>
                            Social Network Graph
                        </Link>
                    </div>
                </div>
                <div className='w-1/4'>
                    <Search className="mb-1" placeholder="search for a user" enterButton="Search" size="large" onSearch={onSearch}/>
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
        </div>
    );
};

export default Header;