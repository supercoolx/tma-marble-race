import React, { useState, useEffect } from 'react';
import Balance from '@/components/Balance';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Common } from 'matter-js'

function EnterCount () {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [price] = useState(Number(state.price)||1)
    const [count, setCount] = useState(1)

    const [ton, setTon] = useState(0);
    const [room, setRoom] = useState(0);
    const [memberCountInRoom, setMemberCountInRoom] = useState(0);
    const [myIndex, setMyIndex] = useState('');
    const [users, setUsers] = useState([])

    useEffect(() => {
        setRoom(Math.floor(Math.random()*1000))
        // setMemberCountInRoom(Math.floor(Math.random()*100))
        setMemberCountInRoom(100)
        setMyIndex('323233')
        setTon(price)
    },[state])

    useEffect(() => {
        if (users.length == 100){
            navigate('/game',{state:{ton,room,memberCountInRoom,myIndex,users}})
        }
    },[users])
    const handlePlayButton = (e) => {
        e.preventDefault();
        getUsersData()
    }

    const getUsersData = () => {
        setUsers([])
        const defaultWidth = 320;
        let cw = window.innerWidth;
        let ratio = cw / defaultWidth;
        for (let i = 0 ; i < count ; i++){
        const user = {
            id: '323233',
            position: {x:Common.random((cw / 2 - 50), (cw / 2 + 50)), y:Common.random(18*ratio, 100*ratio)},
        }
        setUsers((prev) => [...prev, user])
        }
        const userIds= ['763843','386343','873902','174942','374834','123323']
        for (let i = 0 ; i < 100-count; i++){
            let flag = true
            let userId
            do{
                userId = userIds[Math.floor(Math.random()*100)%7]
                if (users.filter((item)=> item.id == userId).length < 20)
                flag = false
            }while(flag)
            const user = {
                id: userId,
                position: {x:Common.random((cw / 2 - 50), (cw / 2 + 50)), y:Common.random(18*ratio, 100*ratio)},
            }
            setUsers((prev) => [...prev, user])
        }
    }


    const handleNavigate = (e) => {
        e.preventDefault()
        navigate('/go',{state:{price,count}})
    }

    const handleMinusButton = () =>{
        if (count > 1)
            setCount((prev) => prev-1)
    }

    const handlePlusButton = () => {
        if (count < 20)
            setCount((prev) => prev+1)
    }

    return(
        <div className='flex flex-col pb-[85px]'>
            <Balance/>
            <div id="body_buy">
                <div id="header" className='text-center mt-[19px] mb-[15px]'>
                    <span className='font-roboto text-[#fff] text-[18px] font-bold'>Play Marble Ruble</span>
                </div>
                <div className='mx-[12px] flex flex-col gap-4'>
                    <div className='flex flex-row gap-12 bg-[#1B1A21] rounded-[11px] px-4 py-[10px] cursor-pointer'>
                        <div className='bg-black border-[#8102FF] border-[2px] rounded-[281px] w-[82px] h-[82px]'>                        </div>
                        <div className='flex flex-col justify-center'>
                            <span className='text-[11.5px] text-[#6E6E6E]'>Price 1 Marble</span>
                            <div className='flex flex-row justify-center items-center mt-2'>
                                <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
                                <span className='text-[15px] text-[#fff] ml-1 font-bold'>{price}</span>
                            </div>
                        </div>
                        <div className='flex flex-col justify-center'>
                            <span className='text-[11.5px] text-[#6E6E6E]'>Winner Prize</span>
                            <div className='flex flex-row justify-center items-center mt-2'>
                                <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
                                <span className='text-[15px] text-[#fff] ml-1 font-bold'>{price*100}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mx-[12px] flex flex-col gap-4'>
                    <div className='flex flex-col bg-[#1B1A21] rounded-[11px] px-4 py-[10px] mt-2'>
                        <div className='grid grid-cols-2 gap-12 text-center'>
                            <span className='text-[11.5px] text-[#6E6E6E]'>Marble in drop</span>
                            <span className='text-[11.5px] text-[#6E6E6E]'>Total cost</span>
                            
                        </div>
                        <div className='flex flex-row gap-24 text-center mt-4'>
                            <div className='bg-[#2D2855] rounded-[300px] flex flex-row p-2'>
                                <div onClick={handleMinusButton} className='border-[1px] border-white rounded-full text-center w-[28px] cursor-pointer'>
                                    <span className='text-[20px] text-white font-bold leading-6'>
                                        -
                                    </span>
                                </div>
                                <span className='mx-7 text-[15.7px] font-bold'>{count}</span>
                                <div onClick={handlePlusButton} className='border-[1px] border-white rounded-full text-center w-[28px] cursor-pointer'>
                                    <span className='text-[20px] text-white font-bold leading-6'>
                                        +
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-row justify-center items-center'>
                                <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
                                <span className='text-[15px] text-[#fff] ml-1 font-bold'>{count*price}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row justify-center'>
                    <div onClick={handlePlayButton} className='mt-[20px] pb-[85px] w-[240px]'>
                        <div className='bg-[#962DFE] px-[63px] py-[12px] rounded-[10px] text-center'>
                            <span className='text-[13px] text-white font-bold'>Enter Pool</span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default EnterCount;
