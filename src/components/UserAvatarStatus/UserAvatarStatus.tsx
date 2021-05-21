import React, { ReactElement } from "react";

function UserAvatarStatus({
  className,
  statusColor,
  avatar,
  animate,
  status,
  ...props
}: {
  statusColor: string;
  avatar: string;
  animate?: boolean;
  status?: boolean;
} & React.SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg className={className} viewBox="0 0 19 19" version="1.1" {...props}>
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
      <g>
        {status !== false && (
          <circle
            cx="15.271"
            cy="15.983"
            r="2"
            opacity="0"
            style={{ fill: statusColor }}
          >
            {animate && (
              <>
                <animate
                  attributeName="r"
                  values="0;0;3.5"
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </>
            )}
          </circle>
        )}

        <image
          mask={
            status !== false
              ? "url(#user-avatar-mask)"
              : "url(#user-avatar-mask-circle)"
          }
          x="0%"
          y="0%"
          width="19px"
          height="19px"
          href={avatar}
        />
        <circle cx="15.271" cy="15.983" r="2" style={{ fill: statusColor }} />
      </g>
    </svg>
  );
}

export default UserAvatarStatus;
