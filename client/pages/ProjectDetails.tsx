import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Sidebar } from "@/components/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { SectionCard } from "@/components/orders/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { RatingStars } from "@/components/orders/RatingStars";
import {
  StatusStepper,
  type ProjectStatus,
} from "@/components/orders/StatusStepper";
import { Download, FileText, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const projectImages = [
  "https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
];

const sampleProject = {
  id: "BE-10234",
  address: "Sunshine Residency, Andheri West, Mumbai",
  type: "Apartment",
  salesman: { name: "Amit Sharma", phone: "+91 98765 43210" },
  designer: { name: "Priya Mehta" },
  contractor: { name: "Rohan Verma" },
  startDate: "2024-06-15",
  eta: "2024-11-30",
  status: "In Progress" as
    | "Quotation Pending"
    | "In Progress"
    | "Material Procurement"
    | "Execution"
    | "Completed"
    | "On Hold"
    | "Cancelled",
  sitePhoto:
    "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1200&auto=format&fit=crop",
  quotationFile: { name: "BE-10234-Quotation.pdf", url: "#" },
  invoices: [
    { name: "Invoice-1.pdf", url: "#" },
    { name: "Invoice-2.pdf", url: "#" },
  ],
  milestones: [
    { label: "Advance (20%)", amount: 200000, status: "Paid", approved: true },
    {
      label: "Design Sign-off (20%)",
      amount: 200000,
      status: "Paid",
      approved: true,
    },
    {
      label: "Material Procurement (30%)",
      amount: 300000,
      status: "Pending",
      approved: true,
    },
    {
      label: "Execution (20%)",
      amount: 200000,
      status: "Pending",
      approved: false,
    },
    {
      label: "Handover (10%)",
      amount: 100000,
      status: "Pending",
      approved: false,
    },
  ],
  discounts: 25000,
  extras: 18000,
  designs: [
    {
      url: "https://images.unsplash.com/photo-1616596878577-2f8a0eb320f6?q=80&w=800&auto=format&fit=crop",
      title: "Living Room Concept",
    },
    {
      url: "https://images.unsplash.com/photo-1582582494700-1ddb44dcd791?q=80&w=800&auto=format&fit=crop",
      title: "Modular Kitchen - Warm Oak",
    },
    {
      url: "https://images.unsplash.com/photo-1616596878578-e8172be86e43?q=80&w=800&auto=format&fit=crop",
      title: "Master Bedroom Wardrobe",
    },
  ],
  materials: [
    {
      type: "Plywood",
      brand: "GreenPly 710",
      qty: "45 sheets",
      status: "Ordered",
    },
    {
      type: "Laminate",
      brand: "Merino 1mm",
      qty: "120 sqm",
      status: "Delivered",
    },
    {
      type: "Hardware",
      brand: "Hettich Hinges",
      qty: "200 pcs",
      status: "Installed",
    },
    { type: "Paint", brand: "Asian Royale", qty: "40 L", status: "Delivered" },
  ],
  permits: [
    { name: "Society NOC.pdf", url: "#" },
    { name: "Electrical Approval.pdf", url: "#" },
  ],
  signoffs: [
    { name: "Design Sign-off.pdf", url: "#" },
    { name: "Material Selection Sign-off.pdf", url: "#" },
  ],
  worksiteMedia: projectImages,
  closure: {
    finalMedia: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop",
    ],
    certificate: { name: "Completion-Certificate.pdf", url: "#" },
    warranty: { name: "Warranty-Documents.pdf", url: "#" },
    afterSales: {
      name: "Rahul Desai",
      phone: "+91 99876 54321",
      email: "support@buildora.com",
    },
    handoverDate: "2024-12-05",
    followupDate: "2025-03-05",
  },
};

export default function ProjectDetails() {
  const { isCollapsed, toggle } = useSidebar();
  const params = useParams();
  const projectId = params.id ?? sampleProject.id;

  const data = useMemo(
    () => ({ ...sampleProject, id: projectId }),
    [projectId],
  );

  const [milestones, setMilestones] = useState(() =>
    data.milestones.map((m, i) => ({ id: `m${i + 1}`, ...m })),
  );
  const totalAmount = milestones.reduce((s, m) => s + m.amount, 0);
  const paidAmount = milestones
    .filter((m) => m.status === "Paid")
    .reduce((s, m) => s + m.amount, 0);
  const progress = Math.round((paidAmount / totalAmount) * 100);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [fixDialog, setFixDialog] = useState<{
    open: boolean;
    id: string | null;
    text: string;
  }>({
    open: false,
    id: null,
    text: "",
  });
  const [payDialog, setPayDialog] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });

  function onPayMilestone(id: string) {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Paid" } : m)),
    );
    const item = milestones.find((m) => m.id === id);
    toast.success(`${item?.label ?? "Milestone"} payment received!`);
  }

  function handleSubmitFix() {
    if (!fixDialog.id) return;
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === fixDialog.id
          ? { ...m, status: "Fix Requested", approved: false }
          : m,
      ),
    );
    setFixDialog({ open: false, id: null, text: "" });
    toast.success("Fix requested. Our team will review this.");
  }

  function handleProceedPayment() {
    if (!payDialog.id) return;
    const id = payDialog.id;
    setPayDialog({ open: false, id: null });
    onPayMilestone(id);
  }

  const overallMaterialStatus = useMemo(() => {
    const statuses = data.materials.map((m) => m.status);
    return statuses.every((s) => s === "Installed")
      ? "All Installed"
      : statuses.every((s) => s === "Delivered" || s === "Installed")
        ? "All Delivered"
        : "In Progress";
  }, [data.materials]);

  return (
    <div className="min-h-screen bg-[#E8E8E8]">
      <div className="pt-24 md:pt-16">
        <div className="flex">
          <div className="hidden xl:block">
            <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
          </div>

          <main
            className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? "xl:ml-16" : "xl:ml-[220px]"}`}
          >
            <div className="max-w-[960px] mx-auto px-4 md:px-6 lg:px-0 pb-40 sm:pb-32 md:pb-28">
              <header className="mt-2 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#333132]">
                  Project {data.id}
                </h1>
                <p className="text-[#666666] mt-1">
                  Detailed view of your interior project
                </p>
              </header>

              {/* 1) Project Overview */}
              <SectionCard>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-[#333132] mb-4">
                      Project Overview
                    </h2>
                    <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 text-sm">
                      <Field label="Project ID" value={data.id} />
                      <Field label="Project Type" value={data.type} />
                      <Field label="Start Date" value={data.startDate} />
                      <Field label="Estimated Completion" value={data.eta} />
                      <Field
                        label="Salesman in Charge"
                        value={`${data.salesman.name} (${data.salesman.phone})`}
                      />
                      <Field
                        label="Designer/Architect"
                        value={data.designer.name}
                      />
                      <Field
                        label="Carpenter/Contractor"
                        value={data.contractor.name}
                      />
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <Field label="Site Location" value={data.address} />
                      </div>
                    </dl>
                    <div
                      className="mt-4 flex items-center gap-2"
                      aria-label={`Current status ${data.status}`}
                    >
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#C69B4B]" />
                      <span className="text-xs text-[#666666]">
                        Current Status
                      </span>
                      <span className="text-sm font-bold text-[#333132]">
                        {data.status}
                      </span>
                    </div>
                    <div className="mt-3">
                      <StatusStepper status={data.status as ProjectStatus} />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* 2) Designs Selected */}
              <SectionCard className="mt-5 md:mt-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#333132] mb-4">
                  Designs Selected
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {data.designs.map((d) => (
                    <Dialog key={d.url}>
                      <DialogTrigger asChild>
                        <button className="group relative rounded-2xl overflow-hidden border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#C69B4B]">
                          <img
                            src={d.url}
                            alt={d.title}
                            loading="lazy"
                            className="w-full h-40 sm:h-48 md:h-56 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white text-xs sm:text-sm">
                            {d.title}
                          </div>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogTitle className="sr-only">{d.title}</DialogTitle>
                        <img
                          src={d.url}
                          alt={d.title}
                          className="w-full h-auto rounded-lg"
                        />
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </SectionCard>

              {/* 3) Materials */}
              <SectionCard className="mt-5 md:mt-8 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.04)_1px,_transparent_1px)] [background-size:20px_20px]" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-[#333132]">
                      Materials
                    </h2>
                    <Badge className="rounded-full bg-[#F2F2F2] text-[#333132] border-none">
                      {overallMaterialStatus}
                    </Badge>
                  </div>
                  {/* Mobile list */}
                  <ul className="md:hidden divide-y divide-[#EFEFEF]">
                    {data.materials.map((m, idx) => (
                      <li
                        key={idx}
                        className="py-3 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#333132]">
                            {m.type}
                          </div>
                          <div className="text-xs text-[#666666]">
                            {m.brand} · {m.qty}
                          </div>
                        </div>
                        <Badge
                          className={
                            m.status === "Installed"
                              ? "bg-[#16a34a] text-white border-none"
                              : m.status === "Delivered"
                                ? "bg-[#fde68a] text-[#333132] border-none"
                                : "bg-[#F2F2F2] text-[#666666] border-none"
                          }
                        >
                          {m.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>

                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="text-left text-[#666666]">
                          <th className="py-2 px-2 sm:py-3 sm:px-3">
                            Material Type
                          </th>
                          <th className="py-2 px-2 sm:py-3 sm:px-3">
                            Brand/Model
                          </th>
                          <th className="py-2 px-2 sm:py-3 sm:px-3">
                            Quantity
                          </th>
                          <th className="py-2 px-2 sm:py-3 sm:px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.materials.map((m, idx) => (
                          <tr
                            key={idx}
                            className="bg-white border-t border-[#EFEFEF]"
                          >
                            <td className="py-2 px-2 sm:py-3 sm:px-3 text-[#333132]">
                              {m.type}
                            </td>
                            <td className="py-2 px-2 sm:py-3 sm:px-3 text-[#333132]">
                              {m.brand}
                            </td>
                            <td className="py-2 px-2 sm:py-3 sm:px-3 text-[#333132]">
                              {m.qty}
                            </td>
                            <td className="py-2 px-2 sm:py-3 sm:px-3">
                              <Badge
                                className={
                                  m.status === "Installed"
                                    ? "bg-[#16a34a] text-white border-none"
                                    : m.status === "Delivered"
                                      ? "bg-[#fde68a] text-[#333132] border-none"
                                      : "bg-[#F2F2F2] text-[#666666] border-none"
                                }
                              >
                                {m.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </SectionCard>

              {/* 4) Work Permits / NOCs */}
              <SectionCard className="mt-5 md:mt-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#333132] mb-4">
                  Work Permits / NOCs
                </h2>
                <ul className="divide-y divide-[#EFEFEF]">
                  {data.permits.map((f) => (
                    <li key={f.name}>
                      <a
                        href={f.url}
                        aria-label={`Download ${f.name}`}
                        className="flex items-start gap-3 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C69B4B] hover:bg-[#F9F9F9] min-h-[48px]"
                      >
                        <FileText className="w-5 h-5 text-[#C69B4B] mt-0.5 flex-shrink-0" />
                        <span className="flex-1 whitespace-normal break-words text-[#666666]">
                          <span className="block text-[#333132] font-medium leading-snug">
                            {f.name}
                          </span>
                        </span>
                        <Download className="w-4 h-4 text-[#C69B4B] flex-shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              {/* 4b) Customer Approvals & Sign-offs */}
              <SectionCard className="mt-5 md:mt-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#333132] mb-4">
                  Customer Approvals & Sign-offs
                </h2>
                <ul className="divide-y divide-[#EFEFEF]">
                  {data.signoffs.map((f) => (
                    <li key={f.name}>
                      <a
                        href={f.url}
                        aria-label={`Download ${f.name}`}
                        className="flex items-start gap-3 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C69B4B] hover:bg-[#F9F9F9] min-h-[48px]"
                      >
                        <FileText className="w-5 h-5 text-[#C69B4B] mt-0.5 flex-shrink-0" />
                        <span className="flex-1 whitespace-normal break-words text-[#666666]">
                          <span className="block text-[#333132] font-medium leading-snug">
                            {f.name}
                          </span>
                        </span>
                        <Download className="w-4 h-4 text-[#C69B4B] flex-shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </SectionCard>

              {/* 5) Financials */}
              <SectionCard className="mt-5 md:mt-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#333132] mb-4">
                  Financials
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <a
                      href={data.quotationFile.url}
                      aria-label={`Open ${data.quotationFile.name}`}
                      className="group flex items-start gap-3 bg-[#F9F9F9] border border-[#D9D9D9] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#C69B4B] min-h-[48px]"
                    >
                      <FileText className="w-5 h-5 text-[#C69B4B] mt-0.5 flex-shrink-0" />
                      <span className="flex-1 text-sm text-[#666666] whitespace-normal break-words">
                        {data.quotationFile.name}
                      </span>
                      <Download className="w-4 h-4 text-[#C69B4B] flex-shrink-0" />
                    </a>

                    <div className="mt-4 rounded-[24px] border border-[#D9D9D9] overflow-hidden shadow-sm">
                      <div className="px-4 py-3 bg-white border-b border-[#EFEFEF] font-semibold text-[#333132]">
                        Payment Milestones
                      </div>
                      <div className="md:hidden">
                        <ul className="bg-white">
                          {milestones.map((m, i) => {
                            const rowStatus =
                              m.status === "Paid"
                                ? "Paid"
                                : m.status === "Fix Requested"
                                  ? "Fix Requested"
                                  : m.approved
                                    ? "Ready for Approval"
                                    : "Pending";
                            return (
                              <li
                                key={m.id}
                                className={`px-4 py-4 sm:py-3 border-t border-[#EFEFEF] ${i % 2 ? "bg-[#FAFAFA]" : "bg-white"}`}
                              >
                                <div className="flex flex-col gap-3">
                                  <div className="min-w-0">
                                    <p className="text-[#333132] font-medium leading-snug">
                                      {m.label}
                                    </p>
                                    <p className="text-[#666666] text-sm">
                                      ₹ {m.amount.toLocaleString()}
                                    </p>
                                    <span
                                      className={`inline-flex mt-1 text-xs px-2 py-0.5 rounded-full border ${
                                        rowStatus === "Paid"
                                          ? "bg-[#16a34a] text-white border-[#16a34a]"
                                          : rowStatus === "Ready for Approval"
                                            ? "bg-[#FFF7E8] text-[#B1873E] border-[#F0D8A8]"
                                            : rowStatus === "Fix Requested"
                                              ? "bg-[#F2F2F2] text-[#666666] border-[#E6E6E6]"
                                              : "bg-[#F2F2F2] text-[#666666] border-[#E6E6E6]"
                                      }`}
                                    >
                                      {rowStatus}
                                    </span>
                                  </div>
                                  <div>
                                    {rowStatus === "Ready for Approval" ? (
                                      <div className="flex flex-col gap-2">
                                        <Button
                                          variant="outline"
                                          className="rounded-xl border-[#D9D9D9] text-[#666666] hover:bg-[#F9F9F9] focus-visible:ring-[#C69B4B]"
                                          aria-label={`Request fix for ${m.label}`}
                                          onClick={() =>
                                            setFixDialog({
                                              open: true,
                                              id: m.id,
                                              text: "",
                                            })
                                          }
                                        >
                                          Request Fix
                                        </Button>
                                        <Button
                                          className="rounded-xl bg-[#C69B4B] hover:bg-[#B1873E] focus-visible:ring-[#C69B4B]"
                                          aria-label={`Approve and pay for ${m.label}`}
                                          onClick={() =>
                                            setPayDialog({
                                              open: true,
                                              id: m.id,
                                            })
                                          }
                                        >
                                          Approve &amp; Pay
                                        </Button>
                                      </div>
                                    ) : rowStatus === "Paid" ? (
                                      <Badge className="bg-[#16a34a] text-white border-none">
                                        Paid
                                      </Badge>
                                    ) : rowStatus === "Fix Requested" ? (
                                      <Badge className="bg-[#F2F2F2] text-[#666666] border-none">
                                        Fix Requested
                                      </Badge>
                                    ) : (
                                      <Button
                                        className="rounded-xl bg-[#F2F2F2] text-[#666666] hover:bg-[#EDEDED]"
                                        aria-label={`${m.label} awaiting approval`}
                                        disabled
                                      >
                                        Awaiting Approval
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left text-[#666666]">
                              <th className="py-3 px-4">Milestone</th>
                              <th className="py-3 px-4">Amount</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {milestones.map((m, i) => {
                              const rowStatus =
                                m.status === "Paid"
                                  ? "Paid"
                                  : m.status === "Fix Requested"
                                    ? "Fix Requested"
                                    : m.approved
                                      ? "Ready for Approval"
                                      : "Pending";
                              return (
                                <tr
                                  key={m.id}
                                  className={`bg-white border-t border-[#EFEFEF] ${i % 2 ? "bg-[#FAFAFA]" : "bg-white"}`}
                                >
                                  <td className="py-3 px-4 text-[#333132]">
                                    {m.label}
                                  </td>
                                  <td className="py-3 px-4 text-[#333132]">
                                    ₹ {m.amount.toLocaleString()}
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge
                                      className={
                                        rowStatus === "Paid"
                                          ? "bg-[#16a34a] text-white border-none"
                                          : rowStatus === "Ready for Approval"
                                            ? "bg-[#FFF7E8] text-[#B1873E] border-[#F0D8A8]"
                                            : "bg-[#F2F2F2] text-[#666666] border-none"
                                      }
                                    >
                                      {rowStatus}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex justify-end gap-2">
                                      {rowStatus === "Ready for Approval" ? (
                                        <>
                                          <Button
                                            variant="outline"
                                            className="rounded-xl border-[#D9D9D9] text-[#666666] hover:bg-[#F9F9F9] focus-visible:ring-[#C69B4B]"
                                            aria-label={`Request fix for ${m.label}`}
                                            onClick={() =>
                                              setFixDialog({
                                                open: true,
                                                id: m.id,
                                                text: "",
                                              })
                                            }
                                          >
                                            Request Fix
                                          </Button>
                                          <Button
                                            className="rounded-xl bg-[#C69B4B] hover:bg-[#B1873E] focus-visible:ring-[#C69B4B]"
                                            aria-label={`Approve and pay for ${m.label}`}
                                            onClick={() =>
                                              setPayDialog({
                                                open: true,
                                                id: m.id,
                                              })
                                            }
                                          >
                                            Approve &amp; Pay
                                          </Button>
                                        </>
                                      ) : rowStatus === "Paid" ? (
                                        <Badge className="bg-[#16a34a] text-white border-none">
                                          Paid
                                        </Badge>
                                      ) : rowStatus === "Fix Requested" ? (
                                        <Badge className="bg-[#F2F2F2] text-[#666666] border-none">
                                          Fix Requested
                                        </Badge>
                                      ) : (
                                        <Button
                                          className="rounded-xl bg-[#F2F2F2] text-[#666666] hover:bg-[#EDEDED]"
                                          aria-label={`${m.label} awaiting approval`}
                                          disabled
                                        >
                                          Awaiting Approval
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4 bg-white">
                        <Progress value={progress} />
                        <div className="mt-2 text-sm text-[#666666]">
                          Payment Progress:{" "}
                          <span className="text-[#333132] font-medium">
                            {progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-[#D9D9D9] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[#666666]">Payment Status</span>
                        <Badge
                          className={
                            paidAmount === totalAmount
                              ? "bg-[#16a34a] text-white border-none"
                              : "bg-[#F2F2F2] text-[#666666] border-none"
                          }
                        >
                          {paidAmount === totalAmount ? "Complete" : "Pending"}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-[#333132] font-medium mb-2">
                          Invoices/Bills
                        </p>
                        <div className="space-y-2">
                          {data.invoices.map((inv) => (
                            <a
                              key={inv.name}
                              href={inv.url}
                              aria-label={`Download ${inv.name}`}
                              className="flex items-start justify-between gap-3 text-sm bg-[#F9F9F9] border border-[#D9D9D9] rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#C69B4B] min-h-[48px]"
                            >
                              <span className="text-[#666666] whitespace-normal break-words mr-2">
                                {inv.name}
                              </span>
                              <Download className="w-4 h-4 text-[#C69B4B] flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#D9D9D9] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#666666]">Discounts/Offers</span>
                        <span className="text-[#333132] font-medium">
                          ₹ {data.discounts.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#666666]">Extra Charges</span>
                        <span className="text-[#333132] font-medium">
                          ₹ {data.extras.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#D9D9D9] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[#666666]">Downloads</span>
                        <UploadCloud className="w-4 h-4 text-[#C69B4B]" />
                      </div>
                      <p className="text-xs text-[#666666] mt-2">
                        Quotation and invoices are uploaded by admin. Customers
                        can view and download.
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* 6) Communication & Feedback */}
              <SectionCard className="mt-5 md:mt-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#333132] mb-4">
                  Communication & Feedback
                </h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <Button className="rounded-xl bg-[#C69B4B] hover:bg-[#B1873E] w-full sm:w-auto">
                      Request Progress
                    </Button>

                    <div>
                      <p className="text-sm font-medium text-[#333132] mb-2">
                        Worksite Photos/Videos
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {data.worksiteMedia.map((m, i) => (
                          <Dialog key={i}>
                            <DialogTrigger asChild>
                              <button className="rounded-xl overflow-hidden border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#C69B4B]">
                                <img
                                  src={m}
                                  alt={`Worksite media ${i + 1}`}
                                  loading="lazy"
                                  className="w-full h-28 object-cover"
                                />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogTitle className="sr-only">
                                Worksite media {i + 1}
                              </DialogTitle>
                              <img
                                src={m}
                                alt={`Worksite media ${i + 1}`}
                                className="w-full h-auto rounded-lg"
                              />
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#333132] mb-2">
                        Customer Notes/Comments
                      </p>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your note..."
                        className="rounded-xl"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#666666]">
                        Final Handover Feedback / Rating
                      </span>
                      {data.status === "Completed" ? (
                        <RatingStars value={rating} onChange={setRating} />
                      ) : (
                        <div className="opacity-50 pointer-events-none">
                          <RatingStars value={0} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* 7) Project Closure */}
              <SectionCard className="mt-5 md:mt-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#333132] mb-4">
                  Project Closure
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-[#333132] mb-2">
                      Final Photos/Videos
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {data.closure.finalMedia.map((m, i) => (
                        <Dialog key={i}>
                          <DialogTrigger asChild>
                            <button className="rounded-xl overflow-hidden border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#C69B4B]">
                              <img
                                src={m}
                                alt={`Final media ${i + 1}`}
                                loading="lazy"
                                className="w-full h-28 object-cover"
                              />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogTitle className="sr-only">
                              Final media {i + 1}
                            </DialogTitle>
                            <img
                              src={m}
                              alt={`Final media ${i + 1}`}
                              className="w-full h-auto rounded-lg"
                            />
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-[#F9F9F9] border border-[#D9D9D9] rounded-lg px-3 py-2">
                      <span className="text-sm text-[#333132]">
                        Completion Certificate
                      </span>
                      <a
                        href={data.closure.certificate.url}
                        className="text-[#C69B4B] hover:text-[#B1873E]"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between bg-[#F9F9F9] border border-[#D9D9D9] rounded-lg px-3 py-2">
                      <span className="text-sm text-[#333132]">
                        Warranty Documents
                      </span>
                      <a
                        href={data.closure.warranty.url}
                        className="text-[#C69B4B] hover:text-[#B1873E]"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="rounded-xl border border-[#D9D9D9] p-4">
                      <p className="text-sm text-[#666666]">
                        After-Sales Support
                      </p>
                      <p className="text-[#333132] font-medium">
                        {data.closure.afterSales.name}
                      </p>
                      <p className="text-sm text-[#666666]">
                        {data.closure.afterSales.phone} •{" "}
                        {data.closure.afterSales.email}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-[#D9D9D9] p-3">
                        <p className="text-xs text-[#666666]">Handover Date</p>
                        <p className="text-[#333132] font-medium">
                          {data.closure.handoverDate}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[#D9D9D9] p-3">
                        <p className="text-xs text-[#666666]">
                          Post-Service Follow-up
                        </p>
                        <p className="text-[#333132] font-medium">
                          {data.closure.followupDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-[#FFF] border border-[#D9D9D9] flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=600&auto=format&fit=crop"
                    alt="Cozy living room"
                    loading="lazy"
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <p className="text-sm text-[#333132]">
                    Thank you for choosing Buildora. We hope your new space
                    brings comfort and joy. Share your experience and help
                    others discover their dream interiors!
                  </p>
                </div>
              </SectionCard>

              {/* Modals */}
              <Dialog
                open={fixDialog.open}
                onOpenChange={(open) => setFixDialog((s) => ({ ...s, open }))}
              >
                <DialogContent className="sm:rounded-2xl">
                  <DialogTitle className="text-[#333132]">
                    {`Request Fix for ${milestones.find((m) => m.id === fixDialog.id)?.label ?? "Milestone"}`}
                  </DialogTitle>
                  <div>
                    <Textarea
                      value={fixDialog.text}
                      onChange={(e) =>
                        setFixDialog((s) => ({ ...s, text: e.target.value }))
                      }
                      placeholder="Describe the issue…"
                      aria-label="Describe the issue"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl border-[#D9D9D9] text-[#666666] hover:bg-[#F9F9F9] focus-visible:ring-[#C69B4B]"
                      onClick={() =>
                        setFixDialog({ open: false, id: null, text: "" })
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      className="rounded-xl bg-[#C69B4B] hover:bg-[#B1873E] focus-visible:ring-[#C69B4B]"
                      onClick={handleSubmitFix}
                    >
                      Submit Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={payDialog.open}
                onOpenChange={(open) => setPayDialog((s) => ({ ...s, open }))}
              >
                <DialogContent className="sm:rounded-2xl">
                  <DialogTitle className="text-[#333132]">
                    Payment Summary
                  </DialogTitle>
                  <div className="text-sm text-[#333132]">
                    <div className="flex items-center justify-between py-1">
                      <span>Milestone</span>
                      <span>
                        {milestones.find((m) => m.id === payDialog.id)?.label ??
                          "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span>Amount</span>
                      <span>
                        ₹{" "}
                        {milestones
                          .find((m) => m.id === payDialog.id)
                          ?.amount.toLocaleString() ?? "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl border-[#D9D9D9] text-[#666666] hover:bg-[#F9F9F9] focus-visible:ring-[#C69B4B]"
                      onClick={() => setPayDialog({ open: false, id: null })}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="rounded-xl bg-[#C69B4B] hover:bg-[#B1873E] focus-visible:ring-[#C69B4B]"
                      onClick={handleProceedPayment}
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="mt-10">
                <Footer />
              </div>
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl w-full bg-[#F9F9F9] border border-[#D9D9D9] p-3 md:p-4"
      role="group"
      aria-label={label}
    >
      <dt className="text-xs text-[#666666] mb-1 font-semibold">{label}</dt>
      <dd className="text-[#333132] break-words leading-snug">{value}</dd>
    </div>
  );
}
