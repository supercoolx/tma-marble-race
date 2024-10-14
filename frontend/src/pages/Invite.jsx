import React, {useState, useEffect} from 'react';
import { useInitData, useUtils } from "@telegram-apps/sdk-react";
import { LINK } from "@/libs/constants";
import API from "@/libs/api";
import Balance from '@/components/Balance';
import Footer from '@/components/Footer';

export default function Invite() {
    const { user } = useInitData();
    const utils = useUtils();
    const [friends, setFriends] = useState([]);
    const [token, setToken] = useState();
    useEffect(() => {
        API.get('/users/friends/' + user.id)
            .then(res => {
                setFriends(res.data.friends);
            }).catch(err => console.error(err.message));
        API.get(`/users/get/${user.id}`)
            .then(res => {
                setToken(res.data.token);
            })
    }, [user]);

    const handleClickInviteLink = (e) => {
        const link = LINK.TELEGRAM_MINIAPP + '?start=' + user.id;
        const shareText = 'Join our telegram mini app.';
        const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shareText)}`;
        utils.openTelegramLink(fullUrl);
    }

    const handleInviteLinkCopyButton = (e) => {
        const link = LINK.TELEGRAM_MINIAPP + '?start=' + user.id;
        const textElement = document.getElementById('copy_button_text');
        navigator.clipboard.writeText(link)
            .then(() => textElement.innerText = 'Copied')
            .then(() => setTimeout(() => { textElement.innerText = 'Copy'; }, 2000))
            .catch();
    }

    return (
        <div className='flex flex-col pb-[85px]'>
            <Balance/>
            <div id="body_friends">
                <div id="header" className='text-center mt-[19px]'>
                    <span className='font-roboto text-[#fff] text-[18px] font-bold'>Become a Referral</span>
                </div>
                <div id="sub_header" className='text-center mt-[8px] mb-[28px]'>
                    <span className='font-roboto text-[#fff] text-[14.2px] font-bold'>and get 10% of all your friends'</span>
                    <span className='font-roboto text-[#fff] text-[14.2px] font-bold'>purchases as a bonus!</span>
                </div>
                <div className='mx-[12px] flex flex-col'>
                    <span className='font-roboto text-white text-[11.3px] font-bold'>Your referral link:</span>
                    <div className='flex flex-col bg-[#1B1A21] rounded-[11px] px-4 py-[10px] mt-1'>
                        <div className='flex flex-row justify-between items-center'>
                            <span className='font-roboto text-[11.5px] text-white font-bold'>url</span>
                            <div className='px-[16px] py-[4px] text-center flex flex-row items-center border-[#8102FF] rounded-[5px] border-[1px]'>
                                <span className='font-roboto text-[11.4px] text-white font-bold'>Copy</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mx-[12px] flex flex-col mt-2'>
                    <span className='font-roboto text-white text-[11.3px] font-bold'>Your free marbles:</span>
                    {friends.map((friend) => (
                        <div className='flex flex-col bg-[#1B1A21] rounded-[11px] px-4 py-[10px] mt-1'>
                            <div className='flex flex-row justify-between items-center'>
                                <span className='font-roboto text-[11.5px] text-white font-bold'>{friends.username}</span>
                                <div className='px-[16px] py-[4px] text-center flex flex-row gap-1 items-center'>
                                    <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt=''/>
                                    <span className='font-roboto font-bold text-[11.3px]'>100</span>
                                </div>
                            </div>
                        </div>    
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    )
}