import React from "react";

function GamePadButton({ value, index, handleClick }) {
    const color = value === 'X' ? 'text-green-500' : 'text-red-500'; 
  return (
    <div
      className="h-24 border-solid border-2 border-black text-center flex justify-center align-middle cursor-pointer"
      onClick={() => {
        handleClick(index);
      }}
    >
        <span className={`${color} font-extrabold flex items-center justify-center text-3xl`}>
            {value}
        </span>
    </div>
  );
}

export default GamePadButton;