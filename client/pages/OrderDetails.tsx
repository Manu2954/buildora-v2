import { useState } from "react";
import { Star, Upload } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { beTokens } from "@/lib/beTokens";

export default function OrderDetails() {
  const currentStatus: string = "In Progress"; // Change as needed
  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleRequestProgress = () => {
    setIsRequestOpen(true);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up API call for progress request
    setIsRequestOpen(false);
  };

  const designs = ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"];
  const finalMedia = ["/placeholder.svg", "/placeholder.svg"];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: beTokens.colors.background,
        color: beTokens.colors.text,
      }}
    >
      <header className="bg-white border-b" style={{ borderColor: "#D9D9D9" }}>
        <div className="max-w-[60rem] mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <img
              src="/buildora-icon.png"
              alt="Buildora Enterprise"
              className="h-8 w-auto"
            />
            <img
              src="/buildora-icon-v1.jpeg"
              alt="Buildora Enterprise"
              className="h-6 w-auto"
            />
          </div>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <a href="/about" className="hover:text-[#C69B4B]">
              About
            </a>
            <a href="https://buildora.com" className="hover:text-[#C69B4B]">
              Website
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-[60rem] mx-auto p-4 md:p-8 space-y-8">
          {/* Project Overview */}
          <section
            id="project-overview"
            className="bg-white border rounded-[24px] p-6 md:p-8"
            style={{ borderColor: "#D9D9D9" }}
          >
            <h2 className="text-xl font-bold mb-6">Project Overview</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="font-medium">Project ID</dt>
                <dd className="text-sm">PRJ-001</dd>
              </div>
              <div>
                <dt className="font-medium">Project Address / Site Location</dt>
                <dd className="text-sm">123, Dream Street, Bangalore</dd>
              </div>
              <div>
                <dt className="font-medium">Project Type</dt>
                <dd className="text-sm">Villa</dd>
              </div>
              <div>
                <dt className="font-medium">Salesman in Charge</dt>
                <dd className="text-sm">Rahul Sharma (9876543210)</dd>
              </div>
              <div>
                <dt className="font-medium">Designer / Architect in Charge</dt>
                <dd className="text-sm">Anita Desai</dd>
              </div>
              <div>
                <dt className="font-medium">
                  Carpenter / Contractor in Charge
                </dt>
                <dd className="text-sm">Kumar Contractors</dd>
              </div>
              <div>
                <dt className="font-medium">Start Date</dt>
                <dd className="text-sm">2024-05-01</dd>
              </div>
              <div>
                <dt className="font-medium">Estimated Completion Date</dt>
                <dd className="text-sm">2024-09-30</dd>
              </div>
              <div>
                <dt className="font-medium">Current Status</dt>
                <dd className="text-sm">{currentStatus}</dd>
              </div>
            </dl>
          </section>

          {/* Financials */}
          <section
            id="financials"
            className="bg-white border rounded-[24px] p-6 md:p-8 space-y-6"
            style={{ borderColor: "#D9D9D9" }}
          >
            <h2 className="text-xl font-bold">Financials</h2>
            <div>
              <label className="font-medium">Quotation File</label>
              <div
                className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm bg-[#f9f9f9]"
                style={{ borderColor: "#D9D9D9" }}
              >
                No file uploaded
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Milestones</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-2">Milestone</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "#D9D9D9" }}>
                  <tr>
                    <td className="py-2">Initial Payment</td>
                    <td className="py-2">₹50,000</td>
                    <td className="py-2">
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                        Paid
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Mid Project</td>
                    <td className="py-2">₹75,000</td>
                    <td className="py-2">
                      <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Final Payment</td>
                    <td className="py-2">₹25,000</td>
                    <td className="py-2">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Payment Status:</span>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                Pending
              </span>
            </div>
            <div>
              <label className="font-medium">Invoices / Bills</label>
              <div className="mt-2 space-y-2">
                <div
                  className="border-2 border-dashed rounded-lg p-4 text-sm bg-[#f9f9f9]"
                  style={{ borderColor: "#D9D9D9" }}
                >
                  No invoices uploaded
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="discounts" className="font-medium">
                  Discounts / Offers Applied
                </label>
                <input
                  id="discounts"
                  type="text"
                  disabled
                  placeholder="None"
                  className="mt-1 w-full border rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C69B4B]"
                  style={{
                    borderColor: "#D9D9D9",
                    borderRadius: beTokens.radii.button,
                  }}
                />
              </div>
              <div>
                <label htmlFor="extra-charges" className="font-medium">
                  Extra Charges
                </label>
                <input
                  id="extra-charges"
                  type="text"
                  disabled
                  placeholder="None"
                  className="mt-1 w-full border rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C69B4B]"
                  style={{
                    borderColor: "#D9D9D9",
                    borderRadius: beTokens.radii.button,
                  }}
                />
              </div>
            </div>
          </section>

          {/* Design Selections */}
          <section
            id="design-selections"
            className="bg-white border rounded-[24px] p-6 md:p-8"
            style={{ borderColor: "#D9D9D9" }}
          >
            <h2 className="text-xl font-bold mb-4">Design Selections</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {designs.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setDesignPreview(src)}
                  className="overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C69B4B]"
                >
                  <img
                    src={src}
                    alt={`Design ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
            <Dialog
              open={!!designPreview}
              onOpenChange={() => setDesignPreview(null)}
            >
              <DialogContent className="p-0 bg-transparent border-none shadow-none">
                {designPreview && (
                  <img
                    src={designPreview}
                    alt="Design preview"
                    className="w-full h-auto"
                  />
                )}
              </DialogContent>
            </Dialog>
          </section>

          {/* Materials & Products */}
          <section
            id="materials"
            className="bg-white border rounded-[24px] p-6 md:p-8"
            style={{ borderColor: "#D9D9D9" }}
          >
            <h2 className="text-xl font-bold mb-4">Materials & Products</h2>
            <p className="font-medium mb-4">
              Material Delivery Status:{" "}
              <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                Ordered
              </span>
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-2">Material Type</th>
                  <th className="py-2">Brand/Model</th>
                  <th className="py-2">Quantity</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#D9D9D9" }}>
                <tr>
                  <td className="py-2">Plywood</td>
                  <td className="py-2">Century Club Prime</td>
                  <td className="py-2">20 sheets</td>
                  <td className="py-2">Ordered</td>
                </tr>
                <tr>
                  <td className="py-2">Laminate</td>
                  <td className="py-2">GreenLam - Walnut</td>
                  <td className="py-2">15 sheets</td>
                  <td className="py-2">Delivered</td>
                </tr>
                <tr>
                  <td className="py-2">Paint</td>
                  <td className="py-2">Asian Paints Royale</td>
                  <td className="py-2">25 L</td>
                  <td className="py-2">Installed</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Communication & Feedback */}
          <section
            id="communication"
            className="bg-white border rounded-[24px] p-6 md:p-8 space-y-6"
            style={{ borderColor: "#D9D9D9" }}
          >
            <h2 className="text-xl font-bold">Communication & Feedback</h2>
            <div>
              <button
                onClick={handleRequestProgress}
                className="px-4 py-2 bg-[#C69B4B] text-white rounded-lg hover:bg-[#B1873E] focus:outline-none focus:ring-2 focus:ring-[#C69B4B]"
              >
                Request Progress
              </button>
              <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                <DialogContent className="max-w-lg">
                  <h3 className="text-lg font-bold mb-4">
                    Request Progress Update
                  </h3>
                  <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div>
                      <label className="font-medium">Upload Media</label>
                      <div
                        className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm flex items-center justify-center"
                        style={{ borderColor: "#D9D9D9" }}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Drag & drop or click to upload
                      </div>
                    </div>
                    <div>
                      <label htmlFor="progress-notes" className="font-medium">
                        Comments
                      </label>
                      <textarea
                        id="progress-notes"
                        className="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C69B4B]"
                        style={{ borderColor: "#D9D9D9" }}
                        placeholder="Add any specific requests..."
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#C69B4B] text-white rounded-lg hover:bg-[#B1873E] focus:outline-none focus:ring-2 focus:ring-[#C69B4B]"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <label htmlFor="customer-notes" className="font-medium">
                Customer Notes / Comments
              </label>
              <textarea
                id="customer-notes"
                className="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C69B4B]"
                style={{ borderColor: "#D9D9D9" }}
                placeholder="Write your comments here..."
              />
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Final Handover Feedback / Rating
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    disabled={currentStatus !== "Completed"}
                    className="focus:outline-none"
                    aria-label={`${star} star rating`}
                  >
                    <Star
                      className="h-6 w-6"
                      style={{
                        color:
                          currentStatus === "Completed" && rating >= star
                            ? "#C69B4B"
                            : "#D9D9D9",
                        fill:
                          currentStatus === "Completed" && rating >= star
                            ? "#C69B4B"
                            : "none",
                      }}
                    />
                  </button>
                ))}
              </div>
              <textarea
                disabled={currentStatus !== "Completed"}
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C69B4B] disabled:opacity-50"
                style={{ borderColor: "#D9D9D9" }}
                placeholder="Leave your feedback"
              />
            </div>
          </section>

          {/* Compliance & Documentation */}
          <section
            id="compliance"
            className="bg-white border rounded-[24px] p-6 md:p-8 space-y-6"
            style={{ borderColor: "#D9D9D9" }}
          >
            <h2 className="text-xl font-bold">Compliance & Documentation</h2>
            <div>
              <label className="font-medium">Work Permits / NOCs</label>
              <div
                className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm"
                style={{ borderColor: "#D9D9D9" }}
              >
                Drag & drop files here
              </div>
            </div>
            <div>
              <label className="font-medium">
                Customer Approvals & Sign-offs
              </label>
              <div
                className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm"
                style={{ borderColor: "#D9D9D9" }}
              >
                Drag & drop files here
              </div>
            </div>
          </section>

          {/* Project Closure */}
          <section
            id="closure"
            className="bg-white border rounded-[24px] p-6 md:p-8 space-y-6"
            style={{ borderColor: "#D9D9D9" }}
          >
            <h2 className="text-xl font-bold">Project Closure</h2>
            <div>
              <label className="font-medium">Final Photos / Videos</label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                {finalMedia.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Final media ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium">Completion Certificate</label>
                <div
                  className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm"
                  style={{ borderColor: "#D9D9D9" }}
                >
                  Pending upload
                </div>
              </div>
              <div>
                <label className="font-medium">Warranty Documents</label>
                <div
                  className="mt-2 border-2 border-dashed rounded-lg p-4 text-sm"
                  style={{ borderColor: "#D9D9D9" }}
                >
                  Pending upload
                </div>
              </div>
              <div>
                <label className="font-medium">
                  After-Sales Support Contact
                </label>
                <input
                  type="text"
                  disabled
                  className="mt-1 w-full border rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C69B4B]"
                  style={{
                    borderColor: "#D9D9D9",
                    borderRadius: beTokens.radii.button,
                  }}
                  placeholder="support@buildora.com"
                />
              </div>
              <div>
                <label className="font-medium">Project Handover Date</label>
                <input
                  type="date"
                  disabled
                  className="mt-1 w-full border rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C69B4B]"
                  style={{
                    borderColor: "#D9D9D9",
                    borderRadius: beTokens.radii.button,
                  }}
                />
              </div>
              <div>
                <label className="font-medium">
                  Post-Service Follow-up Date
                </label>
                <input
                  type="date"
                  disabled
                  className="mt-1 w-full border rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C69B4B]"
                  style={{
                    borderColor: "#D9D9D9",
                    borderRadius: beTokens.radii.button,
                  }}
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer
        className="bg-white border-t mt-8"
        style={{ borderColor: "#D9D9D9" }}
      >
        <div className="max-w-[60rem] mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-sm">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="/privacy" className="hover:text-[#C69B4B]">
              Privacy
            </a>
            <a href="/terms" className="hover:text-[#C69B4B]">
              Terms
            </a>
          </div>
          <p>© {new Date().getFullYear()} Buildora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
