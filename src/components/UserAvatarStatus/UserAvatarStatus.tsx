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
