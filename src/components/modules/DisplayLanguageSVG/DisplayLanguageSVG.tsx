import React from "react";

const DisplayLanguageSVG: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { lang: string }
> = ({ alt, lang, ...props }) => {
  const { default: image } = React.useMemo(
    () => require(`../../../../public/pictures/locales/${lang}.svg`),
    [lang]
  );

  return <img src={image} alt={alt} draggable={false} {...props} />;
};

export default DisplayLanguageSVG;
