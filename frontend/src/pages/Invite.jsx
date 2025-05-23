import React, { useState, useEffect } from 'react';
import { useInitData, useUtils } from "@telegram-apps/sdk-react";
import API from "@/libs/api";
import { LINK } from '@/libs/constants';

export default function Invite() {
    const { user } = useInitData();
    const utils = useUtils();
    const [friends, setFriends] = useState([]);
    const [url, setUrl] = useState('')
    useEffect(() => {
        API.get('/users/friends/' + user.id)
            .then(res => {
                setFriends(res.data.friends);
            }).catch(err => console.error(err.message));

        const link = `${LINK.TELEGRAM_MINIAPP}?start=${user.id}`;
        setUrl(link);
    }, [user]);

    const handleInviteLinkCopyButton = (e) => {
        e.preventDefault()
        const textElement = document.getElementById('copy_button_text');
        navigator.clipboard.writeText(url)
            .then(() => textElement.innerText = 'Copied')
            .then(() => setTimeout(() => { textElement.innerText = 'Copy'; }, 2000))
            .catch();
    }

    const handleClickInvite = () => {
        const shareText = "Join our marble game.";
        const invite_fullUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
        utils.openTelegramLink(invite_fullUrl);
    }

    return (
        <div id="body_friends">
            <div id="header" className='text-center mt-[19px]'>
                <span className='font-roboto text-[#fff] text-3xl font-bold'>Become a Referral</span>
            </div>
            <div id="sub_header" className='flex flex-col text-center mt-[8px] mb-[28px]'>
                <span className='font-roboto text-[#fff] text-sm leading-tight'>and get 10% of all your friends'</span>
                <span className='font-roboto text-[#fff] text-sm leading-tight'>purchases as a bonus!</span>
            </div>
            <div className='flex flex-col mx-6'>
                <span className='font-roboto text-white text-[11px] font-bold'>Your referral link:</span>
                <div className='flex flex-col bg-[#1B1A21] rounded-[11px] px-4 py-[10px] mt-1 border border-white/20'>
                    <div className='flex flex-row items-center justify-between gap-3'>
                        <div className="flex-1">
                            <input type="text" onClick={handleClickInvite} className='w-full text-sm font-bold text-white bg-transparent outline-none cursor-pointer font-roboto' value={url} readOnly />
                        </div>
                        <div onClick={handleInviteLinkCopyButton} className='px-[16px] py-[4px] text-center flex flex-row items-center border-[#8102FF] rounded-[5px] border-[1px] cursor-pointer'>
                            <span id="copy_button_text" className='font-roboto text-[11.4px] text-white font-bold'>Copy</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col mx-6 mt-2'>
                <span className='font-roboto text-white text-[11.3px] font-bold'>Your free marbles:</span>
                {friends.map((friend) => (
                    <div className='flex flex-col bg-[#1B1A21] rounded-[11px] px-4 py-[10px] mt-1'>
                        <div className='flex flex-row items-center justify-between'>
                            <span className='font-roboto text-[11.5px] text-white font-bold'>{friend.username}</span>
                            <div className='px-[16px] py-[4px] text-center flex flex-row gap-1 items-center'>
                                <img className='w-[13px] h-[13px]' src="/imgs/marble_ball.webp" alt='' />
                                <span className='font-roboto font-bold text-[11.3px]'>{friend.balance}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}