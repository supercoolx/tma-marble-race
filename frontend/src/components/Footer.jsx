import { Link } from "@/components/Link";
import { useLocation } from "react-router-dom";

export default function Footer() {
    const { pathname } = useLocation();

    return (
        <div className="flex flex-row justify-center">
            <div className="flex fixed bottom-2 flex-row justify-between px-[37px] bg-[#1B1A21] py-[13px] rounded-[21.4px] w-[96%]">
                <div className="flex flex-col items-center justify-start">
                    <Link to="/menu" className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-transform duration-300`}>
                        <svg className="w-[24px] h-[24px]" fill="#979797" preserveAspectRatio="xMidYMid meet" data-bbox="27.5 28 145 144.001" viewBox="27.5 28 145 144.001" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
                            <g>
                                <path d="M105.937 30.262a8.923 8.923 0 0 0-11.875 0L30.495 86.986c-2.79 2.492-3.732 6.356-2.395 9.844 1.337 3.488 4.608 5.745 8.335 5.745h9.831v60.501c0 4.922 4.002 8.925 8.922 8.925h31.055c4.79 0 8.686-3.897 8.686-8.689v-24.898h12.197v24.898c0 4.792 3.896 8.689 8.681 8.689h29.006c4.92 0 8.922-4.003 8.922-8.925v-60.501h9.831c3.727 0 6.998-2.256 8.335-5.745 1.337-3.488.394-7.351-2.395-9.844l-63.569-56.724zm4.545 96.109H91.571c-4.786 0-8.681 3.897-8.681 8.689v24.898H58.304V90.532H44.611l55.387-49.425 55.392 49.425h-13.693v69.425h-22.533V135.06c0-4.792-3.896-8.689-8.682-8.689z" data-color="1"></path>
                            </g>
                        </svg>
                    </Link>
                    <div className="text-[12px] font-manrope font-medium leading-none text-center text-[#C2C2C2] mt-[7px]">Home</div>
                </div>
                <div className="flex flex-col items-center justify-start">
                    <Link to="/home" className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-transform duration-300`}>
                        <svg className="w-[24px] h-[24px]" fill="#979797" preserveAspectRatio="xMidYMid meet" data-bbox="10 25 180 150" viewBox="10 25 180 150" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
                            <g>
                                <path d="M142.229 44.161c1.984 2.71 3.872 5.516 5.518 8.468 21.344 9.435 36.252 30.823 36.252 55.597 0 33.484-27.249 60.726-60.742 60.726-5.13 0-10.116-.629-14.859-1.839-3.098 1.258-6.244 2.371-9.486 3.29A66.794 66.794 0 0 0 123.257 175C160.089 175 190 145.048 190 108.226c.048-30.242-20.135-55.839-47.771-64.065z" data-color="1"></path>
                                <path d="M173.786 108.226c0-16.016-7.454-30.29-19.118-39.581a80.761 80.761 0 0 1 3.582 23.806c0 27.387-13.697 51.629-34.558 66.29 27.685-.241 50.094-22.741 50.094-50.515z" data-color="1"></path>
                                <path d="M144.843 92.452c0-37.21-30.25-67.452-67.421-67.452S10 55.242 10 92.452s30.25 67.452 67.421 67.452 67.422-30.243 67.422-67.452zm-67.422 61.354c-33.832 0-61.323-27.532-61.323-61.355S43.59 31.097 77.421 31.097s61.323 27.532 61.323 61.355-27.491 61.354-61.323 61.354z" data-color="1"></path>
                                <path d="M77.421 41.452c-28.169 0-51.014 22.839-51.014 51s22.845 51 51.014 51 51.014-22.839 51.014-51-22.845-51-51.014-51zm12.633 70.5c-2.13 2.758-5.034 4.597-8.505 5.565v6.81h-5.808v-6.616c-4.031-.677-7.225-2.129-9.403-4.306-2.178-2.177-3.824-5.565-4.84-10.113l7.018-1.452c.968 3.242 2.13 5.516 3.485 6.919 1.452 1.306 3.388 1.984 5.76 1.984 2.323 0 4.308-.774 5.856-2.274 1.549-1.5 2.323-3.387 2.323-5.758 0-2.081-.629-3.774-1.936-5.081-.678-.63-1.646-1.307-2.904-2.082-1.307-.774-2.904-1.597-4.937-2.516-4.114-1.839-6.824-3.532-8.131-5.081-2.081-2.323-3.098-5.081-3.098-8.323 0-1.548.242-2.952.726-4.258s1.21-2.516 2.13-3.581 2.081-1.984 3.436-2.806c1.355-.774 2.904-1.403 4.999-1.839v-6.206h4.84v6.109c2.842.387 4.875 1.21 6.472 2.468s3.098 3.194 4.55 5.758l-6.195 3.484c-1.888-3.387-4.308-5.081-7.308-5.081-1.888 0-3.436.532-4.646 1.645s-1.839 2.468-1.839 4.161c0 1.5.484 2.758 1.5 3.774.968.968 2.952 2.129 5.905 3.484 2.565 1.161 4.695 2.274 6.389 3.29s2.952 2.032 3.775 3c2.42 2.613 3.582 5.71 3.582 9.387.095 3.583-1.018 6.777-3.196 9.535z" data-color="1"></path>
                            </g>
                        </svg>
                    </Link>
                    <div className="text-[12px] font-manrope font-medium leading-none text-center text-[#C2C2C2] mt-[7px]">Buy</div>
                </div>
                <div className="flex flex-col items-center justify-start">
                    <Link to="/home" className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-transform duration-300`}>
                        <svg className="w-[18px] h-[16px]" fill="#979797" preserveAspectRatio="xMidYMid meet" data-bbox="20 30.5 160 139" viewBox="20 30.5 160 139" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
                            <g>
                                <path d="M180 91.9h-10.7v-40h-14.9l-5.2-21.4H20v139h149.3v-40.1H180V91.9zM33.6 44h104.9l1.9 7.9H33.6V44zm122.1 112H33.6V65.5h122.1V92h-34.4v37.5h34.4V156zm10.7-40.1h-31.6v-10.4h31.6v10.4z" data-color="1"></path>
                            </g>
                        </svg>
                    </Link>
                    <div className="text-[12px] font-manrope font-medium leading-none text-center text-[#C2C2C2] mt-[7px]">Wallet</div>
                </div>
                <div className="flex flex-col items-center justify-start">
                    <Link to="/home" className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-transform duration-300`}>
                        <svg className="w-[20px] h-[18px] fill-[#979797] color-[#979797]" fill="#979797" preserveAspectRatio="xMidYMid meet" data-bbox="38.5 43 123.001 114" viewBox="38.5 43 123.001 114" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
                            <g>
                                <path d="M128.28 107.066l-8.981 42.044 42.202-8.941-7.117-7.092-14.524 3.077c8.138-9.846 13.049-22.434 13.049-36.156C152.908 68.567 127.246 43 95.704 43 64.16 43 38.5 68.567 38.5 99.998S64.16 157 95.704 157c3.779 0 7.469-.377 11.042-1.077l1.944-9.099a48.741 48.741 0 0 1-12.987 1.763c-26.888 0-48.764-21.797-48.764-48.59 0-26.791 21.876-48.588 48.764-48.588s48.762 21.797 48.762 48.588c0 12.782-4.987 24.421-13.119 33.103l4.048-18.945-7.114-7.089z" data-color="1"></path>
                            </g>
                        </svg>
                    </Link>
                    <div className="text-[12px] font-manrope font-medium leading-none text-center text-[#C2C2C2] mt-[7px]">Swap</div>
                </div>
                <div className="flex flex-col items-center justify-start">
                    <Link to="/friend" className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-transform duration-300`}>
                        <svg className="w-[24px] h-[22px] fill-[#979797]" fill="#979797" preserveAspectRatio="xMidYMid meet" data-bbox="29 35 141.667 129.168" viewBox="29 35 141.667 129.168" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="shape" role="presentation" aria-hidden="true" aria-label="">
                            <g>
                                <path d="M83.407 49.6c3.467.08 12.806 1.012 19.551 8.268 5.692 6.1 8.142 15.133 7.284 26.95-.55 12.725-6.384 20.642-11.167 25.033a8.483 8.483 0 0 0-2.767 6.234c-.016 2.925 2.109 5.658 5.15 6.641l13.8 4.542c20.501 6.695 21.99 21.299 22.068 24.507l.002.473-.003.12v5.55c0 3.442-2.8 6.25-6.25 6.25H35.25c-3.442 0-6.25-2.808-6.25-6.25l.003-6.444c.096-3.044 1.648-17.542 22.072-24.206l13.717-4.5c3.475-1.142 5.641-4.442 5.141-7.875a8.415 8.415 0 0 0-2.666-5.033c-4.792-4.4-10.625-12.342-11.192-25.284-.842-11.616 1.608-20.608 7.292-26.708 7.333-7.875 17.525-8.275 19.491-8.275l.55.007Zm36.136-14.596c3.179.06 12.905.84 20.065 8.52 5.784 6.217 8.292 15.176 7.467 26.6-.542 12.492-6.317 20.35-11.067 24.734-.55.508-.908 1.2-1.016 1.95-.109.692.716 1.983 1.666 2.3l11.925 3.933c20.568 6.725 22.009 22.081 22.078 25.3l.001.467-.004.108.009 4c0 5.742-4.675 10.417-10.425 10.417h-16.1c-2.484-7.725-9.017-18.342-26.284-23.975l-12.391-4.075c5.791-5.592 12.45-15.192 13.091-29.983 1.025-14.092-2.166-25.234-9.491-33.117-3.35-3.583-7.134-5.958-10.8-7.592 7.5-9 18.491-9.591 20.808-9.591l.468.004Z" fillRule="evenodd"></path>
                            </g>
                        </svg>
                    </Link>
                    <div className="text-[12px] font-manrope font-medium leading-none text-center text-[#C2C2C2] mt-[7px]">Friends</div>
                </div>            
            </div>
        </div>
    )
}