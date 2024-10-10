import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Common } from 'matter-js'

function Go () {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [ton, setTon] = useState(0);
  const [myCount, setMyCount] = useState(Number(state.count))
  const [room, setRoom] = useState(0);
  const [memberCountInRoom, setMemberCountInRoom] = useState(0);
  const [myIndex, setMyIndex] = useState('');
  const [users, setUsers] = useState([])

  useEffect(() => {
    setRoom(Math.floor(Math.random()*1000))
    // setMemberCountInRoom(Math.floor(Math.random()*100))
    setMemberCountInRoom(100)
    getUsersData()
    setMyIndex('323233')
    setTon(state.price)
  },[state])

  const handlePlayButton = (e) => {
    e.preventDefault();
    navigate('/game',{state:{ton,room,memberCountInRoom,myIndex,users}})
  }

  const getUsersData = () => {
    setUsers([])
    const defaultWidth = 320;
    let cw = window.innerWidth;
    let ratio = cw / defaultWidth;
    for (let i = 0 ; i < myCount ; i++){
      const user = {
        id: '323233',
        position: {x:Common.random((cw / 2 - 50), (cw / 2 + 50)), y:Common.random(18*ratio, 100*ratio)},
      }
      setUsers((prev) => [...prev, user])
    }
    const userIds= ['763843','386343','873902','174942','374834','123323']
    for (let i = 0 ; i < 100-myCount; i++){
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

  return(
    <div className='bg-black pt-[87px]'>
        <div className='flex flex-col justify-center items-center rounded-tl-[39px] rounded-tr-[39px] bg-[#1D1F23] text-center pt-4 px-6'>
            <span className='text-[16px] text-white font-bold'>Play jackpots</span>
            <div className='flex flex-row justify-center items-center bg-black border-[#045AFF] border-[3px] rounded-[281px] w-[102px] h-[102px] mt-4'>
                <span className='text-[18.6px] text-white font-bold'>62/100</span>
            </div>
            <div className='grid grid-cols-2 gap-4 mt-[12px]'>
                <div className='text-center'>
                    <span className='text-[12.2px] text-white font-bold'>Price for 1 Marble in game</span>
                    <div className='bg-[#262A2E] rounded-[6px] py-[10px] px-[20px] flex flex-row items-center gap-1 mt-1'>
                        <div className='w-[15px] h-[15px] rounded-full bg-white'>
                        </div>
                        <span className='text-[12px] text-white font-bold'>{ton} $Marbles</span>
                    </div>
                    <span className='text-[12px] text-[#C2C2C2] font-bold'>Price at TGE ${2*ton}</span>
                </div>
                <div className='text-center'>
                    <span className='text-[12.2px] text-white font-bold'>Jackpot winner prize</span>
                    <div className='bg-[#262A2E] rounded-[6px] py-[10px] px-[20px] flex flex-row items-center gap-1 mt-1'>
                        <div className='w-[15px] h-[15px] rounded-full bg-white'>
                        </div>
                        <span className='text-[12px] text-white font-bold'>{ton*100} $Marbles</span>
                    </div>
                    <span className='text-[12px] text-[#C2C2C2] font-bold'>Price at TGE ${200*ton}</span>
                </div>
            </div>
            <div className='flex flex-row justify-start w-full mt-8 ml-1'>
                <div className='bg-[#262A2E] rounded-[6px] py-[10px] px-[20px] flex flex-row items-center gap-1 mt-1'>
                    <div className='w-[15px] h-[15px] rounded-full bg-white'>
                    </div>
                    <span className='text-[12px] text-white font-bold'>{myCount}</span>
                </div>
            </div>
            <div className='mt-[36px] pb-[85px]'>
                <div onClick={handlePlayButton} className='bg-[#045AFF] px-[63px] py-[12px] rounded-[10px]'>
                    <span className='text-[13px] text-white font-bold'>Enter Jackpot</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Go;
