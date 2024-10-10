import React, { useEffect, useState } from 'react';
import API from '@/libs/api';
import { useInitData } from '@telegram-apps/sdk-react';
import Countdown from 'react-countdown';
import Footer from '@/components/Footer';

export default function Home() {
    const { user } = useInitData();

    const [onion, setOnion] = useState(0);
    const [energy, setEnergy] = useState(0);
    const [maxEnergy, setMaxEnergy] = useState(1000);
    const [earnPerTap, setEarnPerTap] = useState(1);
    const [loseEnergyPerTap, setLoseEnergyPerTap] = useState(10);
    const [endTime, setEndTime] = useState();

    const [plusOnes, setPlusOnes] = useState([]);
    
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!user) return;
        API.get(`/users/get/${user.id}`).then(res => {
            setOnion(res.data.onion);
            setEnergy(res.data.energy);
            setMaxEnergy(res.data.maxEnergy);
            setEarnPerTap(res.data.earnPerTap);
            setLoseEnergyPerTap(res.data.loseEnergyPerTap);
        }).catch(console.error);

        API.get('/users/boost/getmy/' + user.id).then(res => {
            res.data.success && setEndTime(res.data.boost.endTime);
        }).catch(console.error);
    }, [user])


    useEffect(() => {
        const id = setInterval(async () => {
            if (maxEnergy <= energy) {
                clearInterval(id);            
            }
            const res = await API.put('/users/growUp',{userid: user.id});
            if(res.data.success) {
                setEnergy(res.data.energy);
            }
        }, 1000);
        
        return () => clearInterval(id);
    }, [energy, maxEnergy]);

    const handleTap = async (e) => {
        e.preventDefault();

        if(energy < loseEnergyPerTap) {
            return;
        }

        const { pageX, pageY } = e;
        const newPlusOne = {
            id: Date.now(),
            x: pageX,
            y: pageY,
        };
        // Add the new +1 to the state array
        setPlusOnes((prevPlusOnes) => [...prevPlusOnes, newPlusOne]);
        // Remove the +1 after 1 second
        setTimeout(() => {
            setPlusOnes((prevPlusOnes) =>
                prevPlusOnes.filter((plusOne) => plusOne.id !== newPlusOne.id)
            );
        }, 1000); // 1 second animation time
        
        const res = await API.put('/users/tap', {userid: user.id});
        if(res.data.success) {
            setOnion(res.data.onion);
            setEnergy(res.data.energy);
        }
    }

    useEffect(() => {
        setItems([
            {
                value:20,
                price:20,
            },
            {
                value: 105,
                crossValue: 100,
                price: 100
            },
            {
                value: 270,
                crossValue: 250,
                price: 250
            },
            {
                value: 550,
                crossValue: 500,
                price: 500
            },
            {
                value: 1200,
                crossValue: 1000,
                price: 1000
            },
            {
                value: 6500,
                crossValue: 5000,
                price: 5000
            }
        ])
    },[])
    
    const renderItem = ({item, index}) => {
        return  (
            <div key={index} className='flex flex-col'>
                <div className='flex flex-col items-center bg-[#1B1A21] rounded-tl-[12.8px] rounded-tr-[12.8px] border-[#6E6E6E] border-[1px] pt-[10px] pb-[8px]'>
                    <span className='text-center text-[21px] text-[#fff] font-normal'>{item.value}</span>
                    <img className='w-[35px] h-[35px]' src="/imgs/marble_ball.webp" alt=''/>
                </div>
                <div className='flex flex-row justify-center items-center bg-[#251534] rounded-bl-[12.8px] rounded-br-[12.8px] border-[#6E6E6E] border-[1px] border-t-0 py-[9px]'>
                    <span className='text-center text-[19.1px] text-[#fff] font-normal'>${item.price}</span>
                </div>
            </div>
        )
    }

    return (
            <div className='flex flex-col bg-gradient-to-br from-[#1F1C35] to-[#0E0D14] pb-4'>
            {/* {
                endTime ? <Countdown
                    date={endTime}
                    intervalDelay={1000}
                    precision={3}
                    onComplete={() => setEndTime(0)}
                    renderer={(props) => <div className="absolute w-[110px] whitespace-nowrap font-poppins font-bold text-[10px] top-[3px] right-[10px] text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-yellow-500 to-indigo-500 bg-[length:1000px_100px] animate-bg">Boost&nbsp;&nbsp;{props.days ? props.days.toString() + 'd' : ''} {props.hours.toString()} : {props.minutes.toString().padStart(2, '0')} : {props.seconds.toString().padStart(2, '0')}</div>}
                /> : null
            } */}
            
                <span className='font-roboto text-[#6E6E6E] text-[12px] mt-[33px] ml-[23px] font-bold'>Total balance</span>
                <div className=' flex flex-row items-center ml-[23px] mt-[4px]'>
                    <img className='w-[17px] h-[17px]' src="/imgs/marble_ball.webp" alt=''/>
                    <span className='font-roboto ml-[8px] text-[#fff] text-[30px] font-bold'>2.500</span>
                    <div className='h-[29px] ml-[10px] py-[7px] px-[12px] border-[1px] border-[#8102FF] rounded-[10.7px]'>
                        <svg className='w-[15px] h-[15px]' preserveAspectRatio="xMidYMid meet" data-bbox="29.5 29.5 141 141" viewBox="29.5 29.5 141 141" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
                            <g>
                                <path d="M100 29.5c-38.874 0-70.5 31.626-70.5 70.5s31.626 70.5 70.5 70.5 70.5-31.626 70.5-70.5-31.626-70.5-70.5-70.5zm0 133c-34.463 0-62.5-28.037-62.5-62.5S65.537 37.5 100 37.5s62.5 28.037 62.5 62.5-28.037 62.5-62.5 62.5zm30.6-62.5a4 4 0 0 1-4 4H104v22.6a4 4 0 0 1-8 0V104H73.4a4 4 0 0 1 0-8H96V73.4a4 4 0 0 1 8 0V96h22.6a4 4 0 0 1 4 4z" fill="#8102FF" data-color="1"></path>
                            </g>
                        </svg>
                    </div>
                </div>
                <span className='font-roboto ml-[49px] mt-[8px] text-[14px] text-[#6E6E6E] font-bold'>$5000 @TGE</span>
                <span className='font-roboto text-[#fff] text-[18px] text-center mt-[19px] font-bold'>Buy Marbles</span>
                <div className='mx-[26px] grid grid-cols-2 gap-4 pb-[12px] mt-[15px]'>
                    {items.map((item,index) => (
                        <div key={index} className='flex flex-col cursor-pointer'>
                            <div className='flex flex-col items-center bg-[#1B1A21] rounded-tl-[12.8px] rounded-tr-[12.8px] border-[#6E6E6E] border-[1px] pt-[10px] pb-[8px]'>
                                <div>
                                <span className='font-roboto text-center text-[21px] text-[#fff] font-bold'>{item.value}</span>
                                <span className='font-roboto text-center text-[21px] text-[#6E6E6E] font-bold ml-1 line-through'>{item.crossValue}</span>
                                </div>
                                <img className='w-[35px] h-[35px]' src="/imgs/marble_ball.webp" alt=''/>
                            </div>
                            <div className='flex flex-row justify-center items-center bg-[#251534] rounded-bl-[12.8px] rounded-br-[12.8px] border-[#6E6E6E] border-[1px] border-t-0 py-[9px]'>
                                <span className='font-roboto text-center text-[19.1px] text-[#fff] font-bold'>${item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            
            {/* { plusOnes.map((plusOne) =>
                <div key={plusOne.id} className="flex items-center gap-[8px] absolute animate-fadeup pointer-events-none" style={{ left: plusOne.x, top: plusOne.y }}>
                    <img src="/imgs/token.png" width={21} height={23} alt="" />
                    <span className="font-bold text-[28px] leading-[42px] font-poppins text-secondary">{`+${earnPerTap}`}</span>
                </div>)
            } */}
        </div>
    );
}