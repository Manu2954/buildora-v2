import { Users, Shield, Truck, MapPin } from "lucide-react";

const trustTags = [
  {
    icon: Users,
    title: "Trusted by 50+ dealers",
    subtitle: "& professionals",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Shield,
    title: "Verified Manufacturer",
    subtitle: "Partner",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Best Prices",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: MapPin,
    title: "South India",
    subtitle: "Coverage",
    color: "from-orange-500 to-orange-600",
  },
];

function TrustTags() {
  return (
    <section className="animate-slide-up">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-[#333132] text-center lg:text-left">
          Why Choose Buildora Enterprise?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {trustTags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tag.color} flex items-center justify-center flex-shrink-0`}
              >
                <tag.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#333132]">{tag.title}</p>
                <p className="text-sm text-[#666666]">{tag.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustTags;
