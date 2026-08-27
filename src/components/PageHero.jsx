const PageHero = ({ text, heading, subheading }) => {
  return (
    <section>
      <div className="max-w-7xl mx-auto pb-10">
        <span className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-secondary">
          {text}
        </span>

        <h1 className="text-5xl lg:text-7xl font-bold mt-3">{heading}</h1>

        <p className="text-base lg:text-lg text-text-muted mt-4 max-w-2xl">
          {subheading}
        </p>
      </div>
    </section>
  );
};

export default PageHero;
