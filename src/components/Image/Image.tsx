import React from "react";

const Image: React.FC<React.SVGProps<SVGSVGElement> & { src: string }> = ({
  src,
  ...props
}) => {
  return (
    <svg viewBox="0 0 19 19" version="1.1" {...props}>
      <image x="0%" y="0%" width="19px" height="19px" href={src} />
    </svg>
  );
};

export default Image;
