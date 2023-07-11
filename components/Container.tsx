type ContainerProps = {
  children: React.ReactNode;
};

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 md:px-20">{children}</div>
  );
};

export default Container;
