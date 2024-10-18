import React, {useEffect, useState} from 'react'
import { useInitData } from '@telegram-apps/sdk-react';
import API from '@/libs/api';
import { useNavigate } from 'react-router-dom';

export default function Balance({ reload }) {
    const navigate = useNavigate();
    const {user} = useInitData();
    const [balance, setBalance] = useState(0)
    const [tge, setTge] = useState(0)
    useEffect(() => {
        API.get(`/users/get/${user.id}`)
            .then(res => {
                setBalance(res.data.balance)
                setTge(res.data.tge)
            })
    }, [user, reload])

    return (
        <div id="balance" className='ml-[23px] mt-[33px]'>
            <span className='font-roboto font-bold text-[#6E6E6E] text-[12px]'>Total balance</span>
            <div className=' flex flex-row items-center mt-[4px]'>
                <img className='w-[17px] h-[17px]' src="/imgs/marble_ball.webp" alt=''/>
                <span className='font-roboto ml-[8px] text-[#fff] text-[30px] font-bold'>{balance}</span>
                <div onClick={() => navigate('/buy')} className='ml-[10px] py-[6px] px-[12px] border-[2px] border-[#8102FF] rounded-[10.7px]'>
                    <svg className='w-[15px] h-[15px]' preserveAspectRatio="xMidYMid meet" data-bbox="29.5 29.5 141 141" viewBox="29.5 29.5 141 141" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
                        <g>
                            <path d="M100 29.5c-38.874 0-70.5 31.626-70.5 70.5s31.626 70.5 70.5 70.5 70.5-31.626 70.5-70.5-31.626-70.5-70.5-70.5zm0 133c-34.463 0-62.5-28.037-62.5-62.5S65.537 37.5 100 37.5s62.5 28.037 62.5 62.5-28.037 62.5-62.5 62.5zm30.6-62.5a4 4 0 0 1-4 4H104v22.6a4 4 0 0 1-8 0V104H73.4a4 4 0 0 1 0-8H96V73.4a4 4 0 0 1 8 0V96h22.6a4 4 0 0 1 4 4z" fill="#8102FF" data-color="1"></path>
                        </g>
                    </svg>
                </div>
            </div>
            <span className='font-roboto ml-[26px] mt-[8px] text-[14px] text-[#6E6E6E] font-bold'>${tge} @TGE</span>
        </div>
    )
}