const Footer = () => {
  const now = new Date();
  const year = now.getFullYear();

  return (
    <div className="mt-auto bg-gray-100 py-8 px-4 md:px-20">
      <small>© {year} todos los derechos reservados</small>
    </div>
  );
};

export default Footer;
