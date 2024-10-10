import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Common } from 'matter-js'
import Balance from '@/components/Balance';
import Footer from '@/components/Footer';

function Menu () {
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

  const handleRuble = (e) => {
    e.preventDefault();
    navigate('/ruble')
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
    <div className='flex flex-col'>
      <Balance/>
      <div id="body_buy">
            <div id="header" className='text-center mt-[19px] mb-[15px]'>
                <span className='font-roboto text-[#fff] text-[18px] font-bold'>Game modes</span>
            </div>
            <div className='mx-[26px] grid grid-cols-2 gap-5'>
                <div className='cursor-pointer inline-block text-center' onClick={handleRuble}>
                    <img className='w-full rounded-[18.5px] z-10' src="/imgs/game_mode.jpg" alt=''/>
                </div>
                <div className='cursor-pointer inline-block'>
                    <img className='w-full rounded-[18.5px] z-10' src="/imgs/game_mode.jpg" alt=''/>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Menu;

