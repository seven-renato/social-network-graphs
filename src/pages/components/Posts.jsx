import React, { useEffect, useRef, useState } from 'react';
import { Divider, Empty  } from 'antd';

const Posts = (props) => {
    return (
        <div className='flex p-10 overflow-y-scroll' style={{maxHeight: '600px'}}>
            {props.user.mural.length === 0 ? (<Empty description="Parece que seu mural está vazio..." />) : (
                <div>
                    {props.user.mural.map((post) => (
                        <div> 
                            <div className='flex flex-col mb-5'> 
                                <span className="text-lg" style={{fontWeight: 'bold', fontSize: '20px'}}>
                                    {post.username} falou:
                                </span>
                                {post.text}
                            </div>
                            <Divider />
                        </div>
                    ))}   
                </div>
            )}
        </div>
    );
};

export default Posts;

