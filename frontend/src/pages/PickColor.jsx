import React, { useState, useEffect } from 'react';
import Balance from '@/components/Balance';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Common } from 'matter-js'
import { useInitData } from '@telegram-apps/sdk-react';
import API from '@/libs/api';
import { toast } from 'react-toastify';

function PickColor () {
    const navigate = useNavigate();
    const { user } = useInitData();
    const { state } = useLocation();
    const [price] = useState(Number(state.price)||1)
    const [balance, setBalance] = useState(0);
    const [reloading, setReloading] = useState(false)
    const [ton, setTon] = useState(0);
    const [room, setRoom] = useState(0);
    const [memberCountInRoom, setMemberCountInRoom] = useState(0);
    const [myIndex, setMyIndex] = useState('');
    const [myColor, setMyColor] = useState('');
    const [users, setUsers] = useState([])

    useEffect(() => {
        setRoom(Math.floor(Math.random()*1000))
        // setMemberCountInRoom(Math.floor(Math.random()*100))
        setMemberCountInRoom(5)
        setMyIndex('323233')
        setTon(price)
    },[state])

    useEffect(() => {
        API.get(`/users/get/${user.id}`)
            .then(res => {
                setBalance(res.data.balance)
            })
    }, [user])

    useEffect(() => {
        if (users.length == 5){
            navigate('/race',{state:{ton,room,memberCountInRoom,myIndex,users, myColor}})
        }
    },[users])

    const handlePlayButton = (e) => {
        e.preventDefault();
        if (myColor != ''){
            if (price > balance){
                toast("You don't have enough balance. Please buy $Marble")
            }else{
                API.post('/users/payMarble',{userid:user.id,balance:price}).then(res=>{
                    if (res.data.success){
                        getUsersData()
                        setReloading(true)
                    }
                })
            }
        }else{
            toast("Please choose the color")
        }
    }

    const  handleClickColor = (color) => (e) => {
        setMyColor(color)
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    const getUsersData = () => {
        setUsers([])
        const defaultWidth = 320;
        let cw = window.innerWidth;
        let ratio = cw / defaultWidth;
        const userIds= ['763843','386343','873902','174942','374834']
        const colors = ['#ffd700', '#e43292','#ff6b00','#2cca36', '#ff0219']
        const sc = shuffleArray(colors)
        for (let i = 0 ; i < userIds.length; i++){
            const user = {
                id: userIds[i],
                color: sc[i],
                position: {x:23.5 + 11*i + 15 * i, y:21.5},
            }
            setUsers((prev) => [...prev, user])
        }
    }

    return(
        <div className='flex flex-col pb-[85px]'>
            <Balance reloading={reloading} setReloading={setReloading}/>
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
                    <div className='bg-[#1B1A21] rounded-[11px] px-4 py-[16px] mt-2 text-center flex flex-col gap-3'>
                        <span className='font-roboto font-bold text-[12px] text-[#6e6e6e]'>Choose Marble</span>
                        <div className='flex flex-row justify-around '>
                            <div className={`border-transparent border-[1px] p-1 rounded-full ${myColor == '#ffd700' && 'border-white'}`}>
                                <div onClick={handleClickColor('#ffd700')} className={`w-[20px] h-[20px] bg-[#ffd700] rounded-full` }></div>
                            </div>
                            <div className={`border-transparent border-[1px] p-1 rounded-full ${myColor == '#e43292' && 'border-white'}`}>
                                <div onClick={handleClickColor('#e43292')} className='w-[20px] h-[20px] bg-[#e43292] rounded-full'></div>
                            </div>
                            <div className={`border-transparent border-[1px] p-1 rounded-full ${myColor == '#ff6b00' && 'border-white'}`}>
                                <div onClick={handleClickColor('#ff6b00')} className='w-[20px] h-[20px] bg-[#ff6b00] rounded-full'></div>
                            </div>
                                <div className={`border-transparent border-[1px] p-1 rounded-full ${myColor == '#2cca36' && 'border-white'}`}>
                            <div onClick={handleClickColor('#2cca36')} className='w-[20px] h-[20px] bg-[#2cca36] rounded-full'></div>
                            </div>
                                <div className={`border-transparent border-[1px] p-1 rounded-full ${myColor == '#ff0219' && 'border-white'}`}>
                            <div onClick={handleClickColor('#ff0219')} className='w-[20px] h-[20px] bg-[#ff0219] rounded-full'></div>
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

export default PickColor;
