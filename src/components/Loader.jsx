const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-secondary" />
    </div>
  );
};

export default Loader;
