import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Common } from 'matter-js'

const Menu = () => {
  const navigate = useNavigate();
  const [ton, setTon] = useState(0);
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
  },[])

  const handlePlayButton = (e) => {
    e.preventDefault();
    navigate('/game',{state:{ton,room,memberCountInRoom,myIndex,users}})
  }

  const getUsersData = () => {
    setUsers([])
    const defaultWidth = 320;
    let cw = window.innerWidth;
    let ratio = cw / defaultWidth;
    const userIds= ['763843','386343','873902','174942','374834','323233','123323']
    for (let i = 0 ; i < 100; i++){
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
    <div className='bg-[#333] w-full h-[100vh]'>
      <div className='flex flex-row justify-center gap-3 py-2 px-4'>
        <div className='w-full flex justify-center p-2 text-white text-lg border-[2px] border-solid border-[#BF4F74] active:border-[#fff] cursor-pointer' onClick={()=>setTon(1)}>1 $TON</div>
        <div className='w-full flex justify-center p-2 text-white text-lg border-[2px] border-solid border-[#BF4F74] active:border-[#fff] cursor-pointer' onClick={()=>setTon(10)}>10 $TON</div>
        <div className='w-full flex justify-center p-2 text-white text-lg border-[2px] border-solid border-[#BF4F74] active:border-[#fff] cursor-pointer' onClick={()=>setTon(100)}>100 $TON</div>
      </div >
      <div className='flex flex-row justify-center gap-3 py-2 px-4'>
        <div className='text-[#BF4F74] text-lg m-1 py-1 px-4 border-[2px] border-solid border-[#BF4F74] rounded-sm bg-[#333] cursor-pointer' onClick={handlePlayButton}>Play</div>
      </div >
    </div>
  )
}

export default Menu;
