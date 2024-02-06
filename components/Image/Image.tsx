import NextImage from "next/legacy/image";
import type { ImageProps } from "next/legacy/image";

const Image = (props: ImageProps) => {
  const { src, ...rest } = props;

  let imageProps = {
    ...rest,
  };

  if (typeof src === 'string' && /^https:\/\/res.cloudinary.com/.test(src)) {
    imageProps.unoptimized = true;
  }

  return <NextImage src={src} {...imageProps} />;
};

export default Image;
