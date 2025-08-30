import { useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useSidebar } from "@/contexts/SidebarContext";
import { SectionCard } from "@/components/orders/SectionCard";
import { Dropzone, LocalFileItem } from "@/components/orders/Dropzone";
import { MaterialsTable } from "@/components/orders/MaterialsTable";
import { StarRating } from "@/components/orders/StarRating";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";

interface PersonInCharge {
  name: string;
  phone?: string;
}

type ProjectStatus =
  | "Quotation Pending"
  | "In Progress"
  | "Material Procurement"
  | "Execution"
  | "Completed"
  | "On Hold"
  | "Cancelled";

interface ProjectOverviewData {
  id: string;
  address: string;
  type: string;
  salesman: PersonInCharge;
  designer: PersonInCharge;
  carpenter: PersonInCharge;
  startDate: string;
  estimatedCompletion: string;
  status: ProjectStatus;
}

interface MilestoneItem {
  id: string;
  label: string;
  amount: string;
  status: "Paid" | "Pending";
}

export default function Orders() {
  const { isCollapsed, toggle } = useSidebar();

  const [overview] = useState<ProjectOverviewData>({
    id: "BE-PRJ-2025-00042",
    address: "Villa 12, Bloom Gardens, Abu Dhabi, UAE",
    type: "Villa",
    salesman: { name: "Ahmed Ali", phone: "+971 50 123 4567" },
    designer: { name: "Sara Khan", phone: "+971 55 987 6543" },
    carpenter: { name: "Mohammed Hassan", phone: "+971 52 112 2233" },
    startDate: "2025-08-01",
    estimatedCompletion: "2025-12-15",
    status: "In Progress",
  });

  const [quotationFiles, setQuotationFiles] = useState<LocalFileItem[]>([]);
  const [invoiceFiles, setInvoiceFiles] = useState<LocalFileItem[]>([]);
  const [discounts, setDiscounts] = useState("Festival Offer - 5% on laminates");
  const [extraCharges, setExtraCharges] = useState("Site modification - AED 1,500");

  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    { id: "ms1", label: "Booking Advance", amount: "AED 5,000", status: "Paid" },
    { id: "ms2", label: "50% on Material Procurement", amount: "AED 25,000", status: "Pending" },
    { id: "ms3", label: "Final Handover", amount: "AED 20,000", status: "Pending" },
  ]);

  const paymentStatus = useMemo(() => {
    const allPaid = milestones.every((m) => m.status === "Paid");
    return allPaid ? "Complete" : "Pending";
  }, [milestones]);

  const [designUploads, setDesignUploads] = useState<LocalFileItem[]>([]);

  const [requestProgressOpen, setRequestProgressOpen] = useState(false);
  const [requestProgressComment, setRequestProgressComment] = useState("");
  const [requestProgressFiles, setRequestProgressFiles] = useState<LocalFileItem[]>([]);

  const [customerNotes, setCustomerNotes] = useState("");

  const [handoverRating, setHandoverRating] = useState(0);
  const [handoverFeedback, setHandoverFeedback] = useState("");

  const [complianceFiles, setComplianceFiles] = useState<LocalFileItem[]>([]);
  const [approvalFiles, setApprovalFiles] = useState<LocalFileItem[]>([]);

  const [finalMedia, setFinalMedia] = useState<LocalFileItem[]>([]);
  const [completionCertificate, setCompletionCertificate] = useState<LocalFileItem[]>([]);
  const [warrantyDocs, setWarrantyDocs] = useState<LocalFileItem[]>([]);
  const [afterSalesContact, setAfterSalesContact] = useState("support@buildora.com | +971 4 123 4567");
  const [handoverDate, setHandoverDate] = useState("");
  const [followupDate, setFollowupDate] = useState("");

  function submitRequestProgress() {
    // Placeholder handler for future wiring
    console.log("request-progress:submit", { requestProgressComment, requestProgressFiles });
    setRequestProgressOpen(false);
    setRequestProgressComment("");
    setRequestProgressFiles([]);
  }

  return (
    <div className="min-h-screen bg-[#E8E8E8]">
      <div className="pt-24 md:pt-16">
        <div className="flex">
          <div className="hidden xl:block">
            <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
          </div>

          <main className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? "xl:ml-16" : "xl:ml-[220px]"}`}>
            <div className="min-h-screen flex flex-col pb-24 md:pb-0">
              <div className="w-full">
                <div className="mx-auto w-full max-w-[960px] px-4 sm:px-6 md:px-8 py-6 md:py-10 space-y-8 md:space-y-14">
                  {/* Project Overview */}
                  <SectionCard id="project-overview" title="Project Overview" description="Read-only project details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ReadOnlyField label="Project ID" value={overview.id} />
                      <ReadOnlyField label="Project Address / Site Location" value={overview.address} />
                      <ReadOnlyField label="Project Type" value={overview.type} />
                      <ReadOnlyField label="Salesman in Charge (Name & Phone)" value={`${overview.salesman.name} ${overview.salesman.phone ? "- " + overview.salesman.phone : ""}`} />
                      <ReadOnlyField label="Designer / Architect in Charge" value={`${overview.designer.name} ${overview.designer.phone ? "- " + overview.designer.phone : ""}`} />
                      <ReadOnlyField label="Carpenter / Contractor in Charge" value={`${overview.carpenter.name} ${overview.carpenter.phone ? "- " + overview.carpenter.phone : ""}`} />
                      <ReadOnlyField label="Start Date" value={overview.startDate} />
                      <ReadOnlyField label="Estimated Completion Date" value={overview.estimatedCompletion} />
                      <ReadOnlyField label="Current Status" value={overview.status} />
                    </div>
                  </SectionCard>

                  {/* Financials */}
                  <SectionCard id="financials" title="Financials" description="Quotation, milestones, invoices, and adjustments">
                    <div className="space-y-6">
                      <Dropzone label="Quotation File" description="Uploaded by admin; visible to customer" accept=".pdf,.doc,.docx" multiple={false} disabled files={quotationFiles} onChange={setQuotationFiles} />
                      <div>
                        <h3 className="text-lg font-semibold text-[#333132] mb-2">Milestone-wise Payments</h3>
                        <ul className="space-y-2">
                          {milestones.map((m) => (
                            <li key={m.id} className="flex items-center justify-between rounded-lg border border-[#D9D9D9] bg-white p-3">
                              <div className="text-sm text-[#333132]">
                                <span className="font-medium">{m.label}</span> — {m.amount}
                              </div>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${m.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                {m.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#333132]">Payment Status:</span>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${paymentStatus === "Complete" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {paymentStatus}
                          </span>
                        </div>
                      </div>
                      <Dropzone label="Invoices / Bills" description="Read-only uploads" accept=".pdf,.jpg,.png" disabled files={invoiceFiles} onChange={setInvoiceFiles} />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[#333132] mb-2">Discounts / Offers Applied</label>
                          <input value={discounts} onChange={(e) => setDiscounts(e.target.value)} className="w-full rounded-xl border border-[#D9D9D9] bg-white p-3 text-sm text-[#333132] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]" aria-label="Discounts or offers applied" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#333132] mb-2">Extra Charges (if any)</label>
                          <input value={extraCharges} onChange={(e) => setExtraCharges(e.target.value)} className="w-full rounded-xl border border-[#D9D9D9] bg-white p-3 text-sm text-[#333132] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]" aria-label="Extra charges" />
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Design Selections */}
                  <SectionCard id="design-selections" title="Design Selections" description="Chosen designs and references">
                    <div className="space-y-6">
                      <Dropzone label="Upload Designs" description="Images, PDFs, 3D renders" accept="image/*,.pdf" files={designUploads} onChange={setDesignUploads} />
                      {designUploads.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {designUploads.map((f) => (
                            <PreviewItem key={f.id} item={f} />
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center rounded-xl border border-dashed border-[#D9D9D9] bg-[#FAFAFA] p-8 text-[#666666]">
                          <ImageIcon className="mr-2 h-5 w-5" /> No designs uploaded yet
                        </div>
                      )}
                    </div>
                  </SectionCard>

                  {/* Materials & Products */}
                  <SectionCard id="materials-products" title="Materials & Products" description="Auto-linked to Buildora catalogue">
                    <MaterialsTable orderId={overview.id} />
                  </SectionCard>

                  {/* Communication & Feedback */}
                  <SectionCard id="communication-feedback" title="Communication & Feedback">
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <Dialog open={requestProgressOpen} onOpenChange={setRequestProgressOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-[#C69B4B] hover:bg-[#B1873E] text-white">Request Progress</Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[20px]">
                            <DialogHeader>
                              <DialogTitle>Request Progress Update</DialogTitle>
                              <DialogDescription>Upload photos/videos and add comments for the team.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Dropzone label="Upload Media" description="Images or videos" accept="image/*,video/*" files={requestProgressFiles} onChange={setRequestProgressFiles} />
                              <div>
                                <label className="block text-sm font-medium text-[#333132] mb-2">Comments</label>
                                <textarea value={requestProgressComment} onChange={(e) => setRequestProgressComment(e.target.value)} rows={4} className="w-full rounded-xl border border-[#D9D9D9] bg-white p-3 text-sm text-[#333132] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]" aria-label="Progress request comments" />
                              </div>
                            </div>
                            <DialogFooter className="mt-4">
                              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#D9D9D9] bg-white px-4 py-2 text-sm font-medium text-[#333132] hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]" data-state="close">Cancel</button>
                              <Button className="bg-[#C69B4B] hover:bg-[#B1873E] text-white" onClick={submitRequestProgress}>
                                Submit Request
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#333132] mb-2">Customer Notes / Comments</label>
                        <textarea value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} rows={4} className="w-full rounded-xl border border-[#D9D9D9] bg-white p-3 text-sm text-[#333132] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]" aria-label={`Customer notes for project ${overview.id}`} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StarRating label="Final Handover Rating" value={handoverRating} onChange={setHandoverRating} disabled={overview.status !== "Completed"} />
                        <div>
                          <label className="block text-sm font-medium text-[#333132] mb-2">Final Handover Feedback</label>
                          <textarea value={handoverFeedback} onChange={(e) => setHandoverFeedback(e.target.value)} rows={4} disabled={overview.status !== "Completed"} className="w-full rounded-xl border border-[#D9D9D9] bg-white p-3 text-sm text-[#333132] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]" aria-label="Final handover feedback" />
                          {overview.status !== "Completed" ? (
                            <p className="mt-2 text-xs text-[#666666]">Feedback enabled after project is marked Completed.</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Compliance & Documentation */}
                  <SectionCard id="compliance-docs" title="Compliance & Documentation">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Dropzone label="Work Permits / NOCs" description="If applicable" accept=".pdf,.jpg,.png" files={complianceFiles} onChange={setComplianceFiles} />
                      <Dropzone label="Customer Approvals & Sign-offs" accept=".pdf,.jpg,.png" files={approvalFiles} onChange={setApprovalFiles} />
                    </div>
                  </SectionCard>

                  {/* Project Closure */}
                  <SectionCard id="project-closure" title="Project Closure" description="Final summary and documentation">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#333132] mb-2">Final Photos / Videos</label>
                        {finalMedia.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {finalMedia.map((f) => (
                              <PreviewItem key={f.id} item={f} />
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center rounded-xl border border-dashed border-[#D9D9D9] bg-[#FAFAFA] p-8 text-[#666666]">
                            <ImageIcon className="mr-2 h-5 w-5" /> No final media uploaded yet
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Dropzone label="Completion Certificate" accept=".pdf,.jpg,.png" files={completionCertificate} onChange={setCompletionCertificate} />
                        <Dropzone label="Warranty Documents" accept=".pdf,.jpg,.png" files={warrantyDocs} onChange={setWarrantyDocs} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[#333132] mb-2">After-Sales Support Contact</label>
                          <input value={afterSalesContact} onChange={(e) => setAfterSalesContact(e.target.value)} className="w-full rounded-xl border border-[#D9D9D9] bg-white p-3 text-sm text-[#333132] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]" aria-label="After sales support contact" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#333132] mb-2">Project Handover Date</label>
                          <input type="date" value={handoverDate} onChange={(e) => setHandoverDate(e.target.value)} className="w-full rounded-xl border border-[#D9D9D9] bg-white p-3 text-sm text-[#333132] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]" aria-label="Project handover date" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#333132] mb-2">Post-Service Follow-up Date</label>
                          <input type="date" value={followupDate} onChange={(e) => setFollowupDate(e.target.value)} className="w-full rounded-xl border border-[#D9D9D9] bg-white p-3 text-sm text-[#333132] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]" aria-label="Post service follow up date" />
                        </div>
                      </div>
                    </div>
                  </SectionCard>
                </div>
              </div>
              <Footer />
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#333132] mb-1">{label}</label>
      <input value={value} readOnly className="w-full rounded-xl border border-[#D9D9D9] bg-white p-3 text-sm text-[#333132]" aria-readonly="true" aria-label={label} />
    </div>
  );
}

function PreviewItem({ item }: { item: LocalFileItem }) {
  const isImage = !!item.previewUrl;
  const name = item.file?.name ?? "file";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group relative aspect-square w-full overflow-hidden rounded-xl border border-[#D9D9D9] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]">
          {isImage ? (
            <img src={item.previewUrl} alt={name} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-[#666666]">{name}</div>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-[20px] max-w-2xl">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>Preview</DialogDescription>
        </DialogHeader>
        {isImage ? (
          <img src={item.previewUrl} alt={name} className="w-full rounded-lg" />
        ) : (
          <p className="text-sm text-[#666666]">No preview available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
