function CompanyLogos() {
  const companies = [
    {
      icon: "/logos/company-a-icon.svg",
      name: "/logos/company-a-name.svg",
      alt: "Company A",
    },
    {
      icon: "/logos/company-b-icon.svg",
      name: "/logos/company-b-name.svg",
      alt: "Company B",
    },
    {
      icon: "/logos/company-c-icon.svg",
      name: "/logos/company-c-name.svg",
      alt: "Company C",
    },
  ];

  return (
    <section className="py-4">
      <div className="flex flex-wrap justify-center gap-6">
        {companies.map((company, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <img
              src={company.icon}
              alt={`${company.alt} icon`}
              className="h-6 w-6"
              draggable="false"
            />
            <img
              src={company.name}
              alt={company.alt}
              className="h-6"
              draggable="false"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default CompanyLogos;
