import { Link } from "./Link";

const Avatar = ({ userid, width, className, height, username }) => {
    return (
        <div className="relative">
            { username ?
            <Link to={`https://t.me/${username}`}><img className={`rounded-full ${ className }`} src={`/api/v1/users/avatar/${userid}`}  alt="avatar" width={width} height={height} /></Link> :
            <img className="rounded-full" src={`/api/v1/users/avatar/${userid}`}  alt="avatar" width={width} height={height} /> }
        </div>
    );
}

export default Avatar;