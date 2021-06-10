import React from "react";

const DisplayLanguageSVG: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { lang: string }
> = ({ alt, lang, ...props }) => {
  return (
    <img
      src={`/pictures/locales/${lang}.svg`}
      alt={alt}
      draggable={false}
      {...props}
    />
  );
};

export default DisplayLanguageSVG;
