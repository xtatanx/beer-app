import NextImage from "next/image";
import type { ImageProps } from "next/image";

const Image = (props: ImageProps) => {
  const { src, ...rest } = props;

  let imageProps = {
    ...rest,
  };

  if (typeof src === 'string' && /^https:\/\/res.cloudinary.com/.test(src)) {
    imageProps.unoptimized = true;
  }

  return (
    <NextImage
      src={src}
      {...imageProps}
      style={{
        maxWidth: "100%",
        height: "auto"
      }} />
  );
};

export default Image;
