
import Link from "next/link";
import { FaBookOpen } from "react-icons/fa"; 
const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2 justify-center">
            <div className="bg-[#AE7C54] p-2 rounded-lg text-white shadow-md shadow-[#AE7C54]/20">
                <FaBookOpen className="text-xl" />
            </div>
            <span className="font-extrabold text-2xl font-serif tracking-tight text-[#2F6F6D]">
                Fable
            </span>
        </Link>
    );
};

export default Logo;