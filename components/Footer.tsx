const Footer = () => {
  const now = new Date();
  const year = now.getFullYear();

  return (
    <div className="mt-auto border border-t-neutral-200 bg-neutral-100 py-8 px-4 md:px-20">
      <small>© {year} todos los derechos reservados</small>
    </div>
  );
};

export default Footer;
