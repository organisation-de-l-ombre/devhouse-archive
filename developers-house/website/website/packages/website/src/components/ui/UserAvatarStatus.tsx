/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import styled from "styled-components";

function UserAvatarStatus (props: {
    statusColor: string;
    avatar: string;
    animate?: boolean;
}): any {
    return (
        <svg
            {...props}
            viewBox="0 0 19 19"
            version="1.1"
            height="100%"
            width="100%"
        >
            <defs>
                <mask id="user-avatar-mask" x="0" y="0" width="150" height="150">
                    <rect x="0" y="0" width="128px" height="128px" fill="black"/>
                    <path
                        d="M12.641,17.337c-1.103,0.48 -2.32,0.746 -3.599,0.746c-4.991,0 -9.042,-4.051 -9.042,-9.041c0,-4.991 4.051,-9.042 9.042,-9.042c4.99,0 9.041,4.051 9.041,9.042c0,1.626 -0.43,3.153 -1.183,4.472c-0.467,-0.309 -1.028,-0.489 -1.629,-0.489c-1.633,0 -2.958,1.325 -2.958,2.958c0,0.488 0.118,0.948 0.328,1.354Z"
                        fill="white"
                    />
                </mask>
            </defs>
            <g>
                <circle
                    cx="15.271"
                    cy="15.983"
                    r="2"
                    opacity="0"
                    style={{fill: props.statusColor}}
                >
                    {props.animate && (
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
                <image
                    mask="url(#user-avatar-mask)"
                    x="0%"
                    y="0%"
                    width="19px"
                    height="19px"
                    href={props.avatar}
                />
                <circle
                    cx="15.271"
                    cy="15.983"
                    r="2"
                    style={{fill: props.statusColor}}
                />
            </g>
        </svg>
    );
}

export default styled(UserAvatarStatus)`
  min-width: 7rem;
  height: 7rem;
`;
