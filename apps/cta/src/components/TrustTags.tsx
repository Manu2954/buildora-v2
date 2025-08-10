function TrustTags() {
  const tags = [
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
      title: "Trusted by 50+ dealers",
      subtitle: "& professionals"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0012 1.944 11.954 11.954 0 0021.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C9.34 16.67 6 12.225 6 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
      ),
      title: "Verified Manufacturer",
      subtitle: "Partner"
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M7 13v4a2 2 0 002 2h2m0 0a2 2 0 002-2 2 2 0 012-2m-6 2a2 2 0 002 2 2 2 0 002-2"/>
        </svg>
      ),
      title: "Fast Delivery | Best Prices",
      subtitle: "South India Coverage"
    }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl lg:text-2xl font-semibold text-text-base text-center lg:text-left">
        Why Choose Buildora Enterprise?
      </h3>
      
      {/* Desktop: Horizontal Row */}
      <div className="hidden md:flex flex-wrap gap-4 lg:gap-6">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 bg-white p-4 lg:p-6 rounded-xl shadow-sm hover:shadow-md smooth-transition flex-1 min-w-0"
          >
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-brand-gold rounded-xl flex items-center justify-center flex-shrink-0">
              {tag.icon}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-text-base text-sm lg:text-base">{tag.title}</p>
              <p className="text-xs lg:text-sm text-gray-600">{tag.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile: Vertical Stack */}
      <div className="md:hidden space-y-4">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm"
          >
            <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center flex-shrink-0">
              {tag.icon}
            </div>
            <div>
              <p className="font-semibold text-text-base">{tag.title}</p>
              <p className="text-sm text-gray-600">{tag.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrustTags
