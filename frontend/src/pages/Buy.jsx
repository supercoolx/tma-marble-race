import React, { useEffect, useState } from 'react';
import { useInitData } from '@telegram-apps/sdk-react';
import { beginCell } from 'ton-core';
import Balance from '@/components/Balance';
import Footer from '@/components/Footer';
import API from '@/libs/api';
import { toast } from 'react-toastify';
import { useTonWallet, useTonConnectUI, TonConnectButton, CHAIN } from '@tonconnect/ui-react';
import { OWNER_ADDRESS, IS_MAINNET } from "@/libs/constants";

export default function Buy() {
    const { user } = useInitData();
    const wallet = useTonWallet();
    const [tonConnectUI,] = useTonConnectUI();
    const [items, setItems] = useState([]);

    useEffect(() => {
        API.get('/users/items').then(res => {
            if (res.data.success) {
                setItems(res.data.items);
            }
        });
    }, []);

    const transactionComment = (text) => {
        const cell = beginCell()
            .storeUint(0x00000000, 32)
            .storeStringTail(text)
            .endCell();

        const boc = cell.toBoc();
        return boc.toString("base64");
    };

    const handleBuy = (item) => (e) => {
        
        e.preventDefault()
        if (!wallet) return toast.error("Connect your wallet!");
        if (IS_MAINNET && tonConnectUI?.wallet?.account.chain !== CHAIN.MAINNET) {
            return toast.error("Connect your mainnet wallet!");
        }
        if (!IS_MAINNET && tonConnectUI?.wallet?.account.chain === CHAIN.MAINNET) {
            return toast.error("Connect your testnet wallet!");
        }
        
        // const amount = (item.price * Math.pow(10, 9)).toString();
        const amount = item.price * 1e9;
        const payload = transactionComment(JSON.stringify({
            itemid: item.itemid,
            userid: user.id,
        }));

        tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
            network: IS_MAINNET ? CHAIN.MAINNET : CHAIN.TESTNET,
            messages: [
                {
                    address: OWNER_ADDRESS,
                    amount: amount.toString(),
                    payload
                }
            ]
        }).then(tx => {
            console.log('Transaction sent successfully. Wait for a while verification.');
            console.log('Transaction success:', tx);
            return API.post('/users/buyMarble', { userid: user.id });
        }).then(res => {
            if (res.data.success) {
                toast.success('Purchased successfully.');
                document.getElementById('score').innerText = Number(document.getElementById('score').innerText) + item.balance + '';
            }
            else toast.error('Something went wrong!');
        });
    }

    return (
        <div className='flex flex-col pb-[85px]'>
            <Balance />
            <div className="absolute top-3 right-3">
                <TonConnectButton />
            </div>
            <div id="body_buy">
                <div id="header" className='text-center mt-[19px] mb-[15px]'>
                    <span className='font-roboto text-[#fff] text-[18px] font-bold'>Buy Marbles</span>
                </div>
                <div className='mx-[26px] grid grid-cols-2 gap-4'>
                    {items.map((item, index) => (
                        <div key={index} onClick={handleBuy(item)} className='flex flex-col cursor-pointer'>
                            <div className='flex flex-col items-center bg-[#1B1A21] rounded-tl-[12.8px] rounded-tr-[12.8px] border-[#6E6E6E] border-[1px] pt-[10px] pb-[8px]'>
                                <div>
                                    <span className='font-roboto text-[21px] text-[#fff] font-bold'>{item.balance }</span>
                                    <span className='font-roboto text-[21px] text-[#6E6E6E] font-bold ml-1 line-through'>{item.lastBalance || ''}</span>
                                </div>
                                <img className='w-[35px] h-[35px]' src="/imgs/marble_ball.webp" alt='' />
                            </div>
                            <div className='flex flex-row justify-center items-center bg-[#251534] rounded-bl-[12.8px] rounded-br-[12.8px] border-[#6E6E6E] border-[1px] border-t-0 py-[9px]'>
                                <span className='font-roboto text-[19.1px] text-[#fff] font-bold'>{item.price} Ton</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}