import { useState } from 'react';
import "../App.css"
import { FaList } from "react-icons/fa6";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
          <nav className="min-h-min m-6 p-3 text-center border-b border-gray-400">
            <div className='absolute '>
                  <FaList size={'20px'} />
            </div>
            
        <span className='text-3xl font-bold tracking-widest'>
            BESIDER
        </span>
      </nav>
    </>
  )
}

export default Navbar