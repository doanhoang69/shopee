interface ImageProps {
  src: string;
  alt: string;
  className: string;
}

const Image = ({ src, alt, className }: ImageProps) => {
  return (
    <img
      src={`${import.meta.env.VITE_CDN_BASE_URL}/${src}`}
      alt={alt}
      className={className}
    />
  );
};

export default Image;
