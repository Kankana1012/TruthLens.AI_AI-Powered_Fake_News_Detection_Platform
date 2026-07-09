const SectionTitle = ({ title, highlight, subtitle }) => {
  return (
    <div className="section-title">
      <h2>
        {title} <span>{highlight}</span>
      </h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
