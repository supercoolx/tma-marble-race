import React, { useEffect, useState } from 'react';
import { useInitData } from '@telegram-apps/sdk-react';
import Balance from '@/components/Balance';
import Footer from '@/components/Footer';
import API from '@/libs/api';
import { toast } from 'react-toastify';

export default function Buy() {
    const { user } = useInitData();
    
    const [items, setItems] = useState([]);
    const [reloading, setReloading] = useState(false)
    useEffect(() => {
        setItems([
            { value:20, price:20},
            { value: 105, crossValue: 100, price: 100 },
            { value: 270, crossValue: 250, price: 250 },
            { value: 550, crossValue: 500, price: 500 },
            { value: 1200, crossValue: 1000, price: 1000 },
            { value: 6500, crossValue: 5000, price: 5000 }
        ])
    },[])

    const handleBuy = (item) => (e) => {
        e.preventDefault()
        API.post('/users/buyMarble',{userid:user.id,price:item.price,balance: item.value})
            .then(res => {
                if (res.data.success)
                    setReloading(true)
                else
                    toast(res.data.msg)
            })
    }

    return (
        <div className='flex flex-col pb-[85px]'>
            <Balance reloading = {reloading} setReloading={setReloading}/>
            <div id="body_buy">
                <div id="header" className='text-center mt-[19px] mb-[15px]'>
                    <span className='font-roboto text-[#fff] text-[18px] font-bold'>Buy Marbles</span>
                </div>
                <div className='mx-[26px] grid grid-cols-2 gap-4'>
                    {items.map((item,index) => (
                        <div key={index} onClick={handleBuy(item)} className='flex flex-col cursor-pointer'>
                            <div className='flex flex-col items-center bg-[#1B1A21] rounded-tl-[12.8px] rounded-tr-[12.8px] border-[#6E6E6E] border-[1px] pt-[10px] pb-[8px]'>
                                <div>
                                    <span className='font-roboto text-[21px] text-[#fff] font-bold'>{item.value}</span>
                                    <span className='font-roboto text-[21px] text-[#6E6E6E] font-bold ml-1 line-through'>{item.crossValue}</span>
                                </div>
                                <img className='w-[35px] h-[35px]' src="/imgs/marble_ball.webp" alt=''/>
                            </div>
                            <div className='flex flex-row justify-center items-center bg-[#251534] rounded-bl-[12.8px] rounded-br-[12.8px] border-[#6E6E6E] border-[1px] border-t-0 py-[9px]'>
                                <span className='font-roboto text-[19.1px] text-[#fff] font-bold'>${item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
}