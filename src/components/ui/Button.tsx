import React, { ButtonHTMLAttributes, HTMLProps, PropsWithChildren } from 'react';
import styled from 'styled-components';
type ButtonProps = {
    borderRadius?: string;
};

const Button = styled.button<ButtonProps>`
  padding: 0.7rem 1rem 0.7rem 1rem;
  display: inline-flex;
  align-items: center;
  border-radius: ${ (props): string => props.borderRadius || '5px' };
  background-color: ${ (props): string => props.theme.background.primary };
  
  color: ${ (props): string => props.theme.foreground.primary };
  transition: background-color 0.5s;
  :hover {
    background-color: ${ (props): string => props.theme.background.hover.primary };
  }
`;


export const ButtonImage = styled.div<{ size?: string }>`
   display: inline;
   margin: 0 0.25rem;
   svg {
    height: ${ (props: { size?: string }): string => props.size || '32px' };
    width: ${ (props: { size?: string }): string => props.size || '32px' };
    
    vertical-align: middle;
    display: inline-block;
   }
`;

export default Button;
export {
  Button
};