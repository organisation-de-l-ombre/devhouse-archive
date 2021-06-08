import React, { FC } from "react";

export const SVGDefinitions: FC = () => {
  return (
    <svg height={0} version="1.1" viewBox="0 0 19 19">
      <defs>
        <mask id="user-avatar-mask" x="0" y="0" width="150" height="150">
          <rect width="100%" height="100%" fill="black" />
          <path
            d="M12.641,17.337c-1.103,0.48 -2.32,0.746 -3.599,0.746c-4.991,0 -9.042,-4.051 -9.042,-9.041c0,-4.991 4.051,-9.042 9.042,-9.042c4.99,0 9.041,4.051 9.041,9.042c0,1.626 -0.43,3.153 -1.183,4.472c-0.467,-0.309 -1.028,-0.489 -1.629,-0.489c-1.633,0 -2.958,1.325 -2.958,2.958c0,0.488 0.118,0.948 0.328,1.354Z"
            fill="white"
          />
        </mask>
        <mask id="user-avatar-mask-circle" x="0" y="0" width="150" height="150">
          <rect x="0" y="0" width="100%" height="100%" fill="black" />
          <circle cx="50%" cy="50%" r="50%" fill="white" />
        </mask>
      </defs>
    </svg>
  );
};
