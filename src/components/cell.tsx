import {FC} from "react";

function Square({ value, index, /*handleClick*/ }) {
  return (
    <div
      className="h-24 border-solid border-2 border-black text-center flex justify-center align-middle cursor-pointer"
      /*onClick={() => {
        handleClick(index);
      }}*/
    >
        <span className={`font-extrabold flex items-center justify-center text-3xl`}>
            {value}
        </span>
    </div>
  );
}

export default Square;