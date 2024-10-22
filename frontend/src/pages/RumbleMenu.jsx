import React from 'react';
import { useNavigate } from 'react-router-dom';

function RumbleMenu () {
    const navigate = useNavigate();
    
    const handleNavigate = (price) => (e) => {
        e.preventDefault()
        navigate('/enterCount',{state:{price}})
    }

    return(
        <div id="body_rumble_menu">
            <div id="header" className='text-center mt-[19px] mb-[15px]'>
                <span className='font-roboto text-[#fff] text-[18px] font-bold'>Play Marble Rumble</span>
            </div>
            <div className='mx-[12px] flex flex-col gap-4'>
                <div id="menu_rumble_1" onClick={handleNavigate(1)} className='flex flex-row gap-12 bg-[#1B1A21] rounded-[11px] px-4 py-[10px] cursor-pointer'>
                    <div className='bg-black border-[#8102FF] border-[2px] rounded-[281px] w-[82px] h-[82px]'>
                    </div>
                    <div className='flex flex-col justify-center'>
                        <span className='text-[11.5px] text-[#6E6E6E]'>Price 1 Marble</span>
                        <div className='flex flex-row justify-center items-center mt-2'>
                            <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
                            <span className='text-[15px] text-[#fff] ml-1 font-bold'>1</span>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center'>
                        <span className='text-[11.5px] text-[#6E6E6E]'>Winner Prize</span>
                        <div className='flex flex-row justify-center items-center mt-2'>
                            <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
                            <span className='text-[15px] text-[#fff] ml-1 font-bold'>100</span>
                        </div>
                    </div>
                </div>

                <div id="menu_rumble_10" onClick={handleNavigate(10)} className='flex flex-row gap-12 bg-[#1B1A21] rounded-[11px] px-4 py-[10px] cursor-pointer'>
                    <div className='bg-black border-[#8102FF] border-[2px] rounded-[281px] w-[82px] h-[82px]'>
                    </div>
                    <div className='flex flex-col justify-center'>
                        <span className='text-[11.5px] text-[#6E6E6E]'>Price 1 Marble</span>
                        <div className='flex flex-row justify-center items-center mt-2'>
                            <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
                            <span className='text-[15px] text-[#fff] ml-1 font-bold'>10</span>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center'>
                        <span className='text-[11.5px] text-[#6E6E6E]'>Winner Prize</span>
                        <div className='flex flex-row justify-center items-center mt-2'>
                            <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
                            <span className='text-[15px] text-[#fff] ml-1 font-bold'>1,000</span>
                        </div>
                    </div>
                </div>

                <div id="menu_rumble_100" onClick={handleNavigate(100)} className='flex flex-row gap-12 bg-[#1B1A21] rounded-[11px] px-4 py-[10px] cursor-pointer'>
                    <div className='bg-black border-[#8102FF] border-[2px] rounded-[281px] w-[82px] h-[82px]'>
                    </div>
                    <div className='flex flex-col justify-center'>
                        <span className='text-[11.5px] text-[#6E6E6E]'>Price 1 Marble</span>
                        <div className='flex flex-row justify-center items-center mt-2'>
                            <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
                            <span className='text-[15px] text-[#fff] ml-1 font-bold'>100</span>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center'>
                        <span className='text-[11.5px] text-[#6E6E6E]'>Winner Prize</span>
                        <div className='flex flex-row justify-center items-center mt-2'>
                            <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
                            <span className='text-[15px] text-[#fff] ml-1 font-bold'>10,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RumbleMenu;
