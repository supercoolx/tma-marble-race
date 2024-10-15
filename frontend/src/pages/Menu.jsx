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

  const handleRuble = (e) => {
    e.preventDefault();
    navigate('/ruble')
  }

  const handleRace = (e) => {
    e.preventDefault();
    navigate('/race')
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
            <div className='flex flex-col px-3 gap-3'>
              <div onClick={handleRuble} className='flex flex-row items-center justify-between gap-3 bg-[#1B1A20] rounded-md p-3'>
                <div className='bg-black border-[#8102FF] border-[2px] rounded-[281px] p-6'>
                  <svg className='w-[32px] h-[32px]' fill="#fff" preserveAspectRatio="xMidYMid meet" data-bbox="32.444 32.443 135.112 135.114" viewBox="32.444 32.443 135.112 135.114" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
                    <g>
                        <path d="M100 32.443c-37.251 0-67.556 30.306-67.556 67.557S62.749 167.557 100 167.557c37.25 0 67.556-30.306 67.556-67.557S137.25 32.443 100 32.443zm0 123.166c-30.663 0-55.61-24.946-55.61-55.609S69.337 44.389 100 44.389 155.611 69.337 155.611 100c0 30.663-24.948 55.609-55.611 55.609z" data-color="1"></path>
                        <path d="M113.462 121.456H86.54a4.307 4.307 0 1 0 0 8.614h26.922a4.308 4.308 0 1 0 0-8.614z" data-color="1"></path>
                        <path d="M130.602 81.389a3.552 3.552 0 0 0-5.029 0l-5.346 5.345-5.347-5.345a3.55 3.55 0 0 0-5.027 0 3.554 3.554 0 0 0 0 5.029l5.345 5.347-5.345 5.345a3.556 3.556 0 0 0 0 5.031 3.54 3.54 0 0 0 2.514 1.043c.91 0 1.821-.348 2.513-1.043l5.347-5.347 5.346 5.347c.694.695 1.606 1.043 2.516 1.043s1.82-.348 2.513-1.043a3.553 3.553 0 0 0 0-5.031l-5.343-5.345 5.343-5.347a3.55 3.55 0 0 0 0-5.029z" data-color="1"></path>
                        <path d="M85.117 102.141a3.543 3.543 0 0 0 2.516 1.043 3.556 3.556 0 0 0 2.515-6.074l-5.346-5.345 5.346-5.347a3.554 3.554 0 0 0 0-5.029 3.554 3.554 0 0 0-5.031 0l-5.347 5.345-5.343-5.345a3.553 3.553 0 0 0-5.03 0 3.556 3.556 0 0 0 0 5.029l5.347 5.347-5.347 5.345a3.558 3.558 0 0 0 5.03 5.031l5.343-5.347 5.347 5.347z" data-color="1"></path>
                    </g>
                  </svg>
                </div>
                <div className='flex flex-col'>
                  <span className='font-roboto text-white text-[16px] font-bold'>Marble Rumble</span>
                  <span className='font-roboto text-[#6E6E6E] text-[12px] font-bold'>Play with 100 Marbles, last marble that stays in the game wins the jackpot.</span>
                </div>
              </div>
              <div onClick={handleRace} className='flex flex-row items-center justify-between gap-3 bg-[#1B1A20] rounded-md p-3'>
                <div className='bg-black border-[#8102FF] border-[2px] rounded-[281px] p-6'>
                <svg
                    className="w-[32px] h-[32px]"
                    fill="#fff"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 453.405 453.405"
                    xmlSpace="preserve"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <g>
                          <path d="M382.08,60.394c-26.324-4.534-53.444-0.845-79.764,1.751c-26.223,2.587-53.604,5.753-79.585-0.397 c-30.592-7.241-49.945-27.294-64.216-54.464c-3.935,10.646-7.869,21.291-11.803,31.938 c-25.74,69.646-51.479,139.292-77.218,208.938L0,436.203l26.838,9.919l62.541-169.227c11.607,12.383,25.937,21.375,44.333,25.729 c25.979,6.146,53.363,2.986,79.584,0.398c26.318-2.601,53.441-6.287,79.765-1.752c33.826,5.826,55.682,26.086,71.323,55.871 c29.677-80.291,59.348-160.583,89.021-240.876C437.761,86.479,415.911,66.222,382.08,60.394z M385.379,203.349 c-13.234-11.169-27.441-18.638-44.57-21.931c-5.715,15.458-11.428,30.916-17.141,46.374c17.131,3.295,31.335,10.764,44.572,21.932 c-5.239,14.176-10.479,28.353-15.717,42.526c-13.234-11.168-27.443-18.642-44.573-21.93c5.239-14.177,10.479-28.353,15.718-42.528 c-17.442-2.813-34.473-2.797-52.072-1.72c-5.238,14.176-10.479,28.353-15.717,42.528c-18.21,1.471-36.358,3.56-54.567,5.028 c5.238-14.178,10.478-28.353,15.716-42.526c-17.599,1.078-34.631,1.096-52.073-1.719c-5.239,14.176-10.478,28.352-15.717,42.526 c-17.128-3.29-31.341-10.763-44.572-21.933c5.238-14.174,10.478-28.351,15.716-42.525c13.236,11.17,27.442,18.64,44.573,21.932 c5.712-15.458,11.427-30.918,17.139-46.376c-17.13-3.285-31.338-10.766-44.573-21.93c5.714-15.46,11.427-30.92,17.14-46.378 c13.236,11.173,27.442,18.635,44.572,21.933c5.239-14.176,10.478-28.351,15.717-42.525c17.442,2.813,34.476,2.797,52.073,1.717 c-5.238,14.175-10.478,28.351-15.717,42.526c18.209-1.471,36.357-3.558,54.567-5.028c5.238-14.175,10.479-28.351,15.717-42.527 c17.601-1.078,34.629-1.095,52.072,1.719c-5.239,14.176-10.478,28.351-15.717,42.528c17.131,3.294,31.335,10.761,44.573,21.93 C396.806,172.431,391.095,187.891,385.379,203.349z" />
                          <path d="M234.167,184.726c-5.713,15.459-11.426,30.917-17.14,46.376c18.21-1.472,36.359-3.56,54.568-5.03 c5.713-15.457,11.426-30.916,17.139-46.374C270.523,181.169,252.376,183.257,234.167,184.726z" />
                          <path d="M234.167,184.726c5.714-15.458,11.427-30.918,17.14-46.375c-17.604,1.075-34.629,1.093-52.075-1.718 c-5.713,15.458-11.426,30.917-17.139,46.375C199.536,185.824,216.566,185.807,234.167,184.726z" />
                          <path d="M305.873,133.323c-5.713,15.458-11.426,30.916-17.139,46.375c17.601-1.075,34.629-1.093,52.073,1.72 c5.712-15.458,11.426-30.917,17.138-46.375C340.503,132.229,323.474,132.243,305.873,133.323z" />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div className='flex flex-col'>
                  <span className='font-roboto text-white text-[16px] font-bold'>Marble Race</span>
                  <span className='font-roboto text-[#6E6E6E] text-[12px] font-bold'>A race with 5 marbles through an obstacle course. Be the first marble at the finish to win.</span>
                </div>
              </div>
            </div>
            <div className='text-center mt-5'>
              <span className='font-roboto font-bold text-[#6e6e6e] text-[12px]'>More coming soon...</span>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Menu;

