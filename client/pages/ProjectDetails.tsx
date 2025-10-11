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
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/lib/projects";
import type {
  Milestone as ProjectMilestone,
  Project as ProjectDetails,
} from "@/lib/types/project";

const DEFAULT_PROJECT_ID = "BE-10234";

type MilestoneState = ProjectMilestone & {
  status: ProjectMilestone["status"] | "Fix Requested";
};

const formatCurrency = (value: number) =>
  `Rs. ${Math.round(value).toLocaleString("en-IN")}`;

const formatContact = (contact?: { name: string; phone?: string; email?: string }) => {
  if (!contact) return "Not assigned";
  if (contact.phone) return `${contact.name} (${contact.phone})`;
  return contact.name;
};

const formatDateValue = (value?: string) => value ?? "Not set";

const resolveMaterialStatus = (status?: string) => status ?? "Planned";

const materialBadgeClass = (status: string) => {
  if (status === "Installed") return "bg-[#16a34a] text-white border-none";
  if (status === "Delivered") return "bg-[#fde68a] text-[#333132] border-none";
  return "bg-[#F2F2F2] text-[#666666] border-none";
};

export default function ProjectDetails() {
  const { isCollapsed, toggle } = useSidebar();
  const params = useParams<{ id?: string }>();
  const projectId = (params.id ?? DEFAULT_PROJECT_ID).toUpperCase();

  const {
    data: project,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
    enabled: Boolean(projectId),
    staleTime: 30_000,
  });

  const [milestones, setMilestones] = useState<MilestoneState[]>([]);
  useEffect(() => {
    if (project) {
      setMilestones(project.milestones.map((m) => ({ ...m })));
    } else {
      setMilestones([]);
    }
  }, [project]);

  const totalAmount = useMemo(
    () => milestones.reduce((sum, item) => sum + (item.amount ?? 0), 0),
    [milestones],
  );
  const paidAmount = useMemo(
    () =>
      milestones
        .filter((item) => item.status === "Paid")
        .reduce((sum, item) => sum + (item.amount ?? 0), 0),
    [milestones],
  );
  const progress =
    totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

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

  useEffect(() => {
    if (error instanceof Error) {
      toast.error(error.message);
    } else if (error) {
      toast.error("Failed to load project details");
    }
  }, [error]);

  const overallMaterialStatus = useMemo(() => {
    if (!project) return "No materials";
    if (!project.materials.length) return "No materials";
    const statuses = project.materials.map((m) => m.status ?? "Planned");
    if (statuses.every((s) => s === "Installed")) return "All Installed";
    if (statuses.every((s) => s === "Delivered" || s === "Installed"))
      return "All Delivered";
    return "In Progress";
  }, [project]);

  const renderShell = (body: ReactNode) => (
    <div className="min-h-screen bg-[#E8E8E8]">
      <div className="pt-40 sm:pt-32 md:pt-16">
        <div className="flex">
          <div className="hidden xl:block">
            <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
          </div>

          <main
            className={`flex-1  overflow-x-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "xl:ml-16" : "xl:ml-[220px]"}`}
          >
            <div className="max-w-[960px] mx-auto px-0 sm:px-4 md:px-6 lg:px-0 pb-40 sm:pb-32 md:pb-28">
              {body}
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );

  if (isLoading || isFetching) {
    return renderShell(
      <div className="py-24 text-center text-[#666666]">
        Loading project details...
      </div>,
    );
  }

  if (error) {
    return renderShell(
      <div className="py-24 text-center space-y-3">
        <p className="text-[#B91C1C] font-semibold">Failed to load project.</p>
        <Button
          className="rounded-xl bg-[#C69B4B] hover:bg-[#B1873E] focus-visible:ring-[#C69B4B]"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </div>,
    );
  }

  if (!project) {
    return renderShell(
      <div className="py-24 text-center text-[#666666]">
        Project not found.
      </div>,
    );
  }

  const data = project;
  const selectedPayMilestone = payDialog.id
    ? milestones.find((m) => m.id === payDialog.id)
    : undefined;
  const closure = data.closure;
  const closureFinalMedia = closure?.finalMedia ?? [];

  return renderShell(
    <>
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
                      <Field label="Start Date" value={formatDateValue(data.startDate)} />
                      <Field
                        label="Estimated Completion"
                        value={formatDateValue(data.eta)}
                      />
                      <Field
                        label="Salesman in Charge"
                        value={formatContact(data.salesman)}
                      />
                      <Field
                        label="Designer/Architect"
                        value={formatContact(data.designer)}
                      />
                      <Field
                        label="Carpenter/Contractor"
                        value={formatContact(data.contractor)}
                      />
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <Field label="Site Location" value={data.address} />
                      </div>
                    </dl>
                    <div
                      className="mt-4 flex flex-wrap items-center gap-2"
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
        {data.designs.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.designs.map((d) => (
              <Dialog key={d.id ?? d.url}>
                <DialogTrigger asChild>
                  <button className="group relative rounded-2xl overflow-hidden border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#C69B4B]">
                    <img
                      src={d.url}
                      alt={d.title ?? "Design preview"}
                      loading="lazy"
                      className="w-full h-40 sm:h-48 md:h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white text-xs sm:text-sm">
                      {d.title ?? "Untitled design"}
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogTitle className="sr-only">
                    {d.title ?? "Design preview"}
                  </DialogTitle>
                  <img
                    src={d.url}
                    alt={d.title ?? "Design preview"}
                    className="w-full h-auto rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#666666]">
            No design assets uploaded yet.
          </p>
        )}
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
          {data.materials.length ? (
            <>
              <ul className="md:hidden divide-y divide-[#EFEFEF]">
                {data.materials.map((m, idx) => {
                  const status = resolveMaterialStatus(m.status);
                  const details =
                    [m.brand, m.qty].filter(Boolean).join(" / ") ||
                    "Details pending";
                  return (
                    <li
                      key={m.id ?? idx}
                      className="py-3 flex items-start justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#333132]">
                          {m.type}
                        </div>
                        <div className="text-xs text-[#666666]">{details}</div>
                      </div>
                      <Badge className={materialBadgeClass(status)}>
                        {status}
                      </Badge>
                    </li>
                  );
                })}
              </ul>

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
                    {data.materials.map((m, idx) => {
                      const status = resolveMaterialStatus(m.status);
                      return (
                        <tr
                          key={m.id ?? `${m.type}-${idx}`}
                          className="bg-white border-t border-[#EFEFEF]"
                        >
                          <td className="py-2 px-2 sm:py-3 sm:px-3 text-[#333132]">
                            {m.type}
                          </td>
                          <td className="py-2 px-2 sm:py-3 sm:px-3 text-[#333132]">
                            {m.brand ?? "Not provided"}
                          </td>
                          <td className="py-2 px-2 sm:py-3 sm:px-3 text-[#333132]">
                            {m.qty ?? "Not specified"}
                          </td>
                          <td className="py-2 px-2 sm:py-3 sm:px-3">
                            <Badge className={materialBadgeClass(status)}>
                              {status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-sm text-[#666666]">
              No material lines recorded yet.
            </p>
          )}
        </div>
      </SectionCard>

              {/* 4) Work Permits / NOCs */}
              <SectionCard className="mt-5 md:mt-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#333132] mb-4">
                  Work Permits / NOCs
                </h2>
                  {data.permits.length ? (
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
                  ) : (
                    <p className="text-sm text-[#666666]">
                      No permits uploaded yet.
                    </p>
                  )}
              </SectionCard>

              {/* 4b) Customer Approvals & Sign-offs */}
              <SectionCard className="mt-5 md:mt-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#333132] mb-4">
                  Customer Approvals & Sign-offs
                </h2>
                  {data.signoffs.length ? (
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
                  ) : (
                    <p className="text-sm text-[#666666]">
                      No sign-offs recorded yet.
                    </p>
                  )}
              </SectionCard>

              {/* 5) Financials */}
              <SectionCard className="mt-5 md:mt-8">
                <h2 className="text-xl md:text-2xl font-semibold text-[#333132] mb-4">
                  Financials
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    {data.quotationFile ? (
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
                    ) : (
                      <div className="rounded-xl border border-[#D9D9D9] bg-[#F9F9F9] p-3 text-sm text-[#666666]">
                        Quotation not uploaded yet.
                      </div>
                    )}

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
                                      {formatCurrency(m.amount)}
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
                                    {formatCurrency(m.amount)}
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
                            {data.invoices.length ? (
                              data.invoices.map((inv) => (
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
                              ))
                            ) : (
                              <p className="text-xs text-[#666666]">
                                No invoices uploaded yet.
                              </p>
                            )}
                          </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#D9D9D9] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#666666]">Discounts/Offers</span>
                        <span className="text-[#333132] font-medium">
                          {formatCurrency(data.discounts)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#666666]">Extra Charges</span>
                        <span className="text-[#333132] font-medium">
                          {formatCurrency(data.extras)}
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
                      {data.worksiteMedia.length ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {data.worksiteMedia.map((media, i) => {
                            const key = media.id ?? `${media.url}-${i}`;
                            const label = media.caption ?? `Worksite media ${i + 1}`;
                            const isVideo = media.kind === "video";
                            return (
                              <Dialog key={key}>
                                <DialogTrigger asChild>
                                  <button className="rounded-xl overflow-hidden border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#C69B4B]">
                                    {isVideo ? (
                                      <video
                                        src={media.url}
                                        aria-label={label}
                                        className="w-full h-28 object-cover"
                                        muted
                                        playsInline
                                      />
                                    ) : (
                                      <img
                                        src={media.url}
                                        alt={label}
                                        loading="lazy"
                                        className="w-full h-28 object-cover"
                                      />
                                    )}
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogTitle className="sr-only">
                                    {label}
                                  </DialogTitle>
                                  {isVideo ? (
                                    <video
                                      src={media.url}
                                      controls
                                      className="w-full h-auto rounded-lg"
                                    />
                                  ) : (
                                    <img
                                      src={media.url}
                                      alt={label}
                                      className="w-full h-auto rounded-lg"
                                    />
                                  )}
                                  {media.caption ? (
                                    <p className="mt-2 text-sm text-[#666666]">
                                      {media.caption}
                                    </p>
                                  ) : null}
                                </DialogContent>
                              </Dialog>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-[#666666]">
                          No worksite media shared yet.
                        </p>
                      )}
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
                {closure ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-[#333132] mb-2">
                        Final Photos/Videos
                      </p>
                      {closureFinalMedia.length ? (
                        <div className="grid grid-cols-2 gap-3">
                          {closureFinalMedia.map((media, i) => {
                            const key = media.id ?? `${media.url}-${i}`;
                            const label = media.caption ?? `Final media ${i + 1}`;
                            const isVideo = media.kind === "video";
                            return (
                              <Dialog key={key}>
                                <DialogTrigger asChild>
                                  <button className="rounded-xl overflow-hidden border border-[#D9D9D9] focus:outline-none focus:ring-2 focus:ring-[#C69B4B]">
                                    {isVideo ? (
                                      <video
                                        src={media.url}
                                        aria-label={label}
                                        className="w-full h-28 object-cover"
                                        muted
                                        playsInline
                                      />
                                    ) : (
                                      <img
                                        src={media.url}
                                        alt={label}
                                        loading="lazy"
                                        className="w-full h-28 object-cover"
                                      />
                                    )}
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogTitle className="sr-only">{label}</DialogTitle>
                                  {isVideo ? (
                                    <video
                                      src={media.url}
                                      controls
                                      className="w-full h-auto rounded-lg"
                                    />
                                  ) : (
                                    <img
                                      src={media.url}
                                      alt={label}
                                      className="w-full h-auto rounded-lg"
                                    />
                                  )}
                                  {media.caption ? (
                                    <p className="mt-2 text-sm text-[#666666]">
                                      {media.caption}
                                    </p>
                                  ) : null}
                                </DialogContent>
                              </Dialog>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-[#666666]">
                          No final media uploaded yet.
                        </p>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-[#F9F9F9] border border-[#D9D9D9] rounded-lg px-3 py-2">
                        <span className="text-sm text-[#333132]">
                          Completion Certificate
                        </span>
                        {closure?.certificate ? (
                          <a
                            href={closure.certificate.url}
                            className="text-[#C69B4B] hover:text-[#B1873E]"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-xs text-[#666666]">Not available</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between bg-[#F9F9F9] border border-[#D9D9D9] rounded-lg px-3 py-2">
                        <span className="text-sm text-[#333132]">
                          Warranty Documents
                        </span>
                        {closure?.warranty ? (
                          <a
                            href={closure.warranty.url}
                            className="text-[#C69B4B] hover:text-[#B1873E]"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-xs text-[#666666]">Not available</span>
                        )}
                      </div>
                      <div className="rounded-xl border border-[#D9D9D9] p-4">
                        <p className="text-sm text-[#666666]">
                          After-Sales Support
                        </p>
                        {closure?.afterSales ? (
                          <>
                            <p className="text-[#333132] font-medium">
                              {closure.afterSales.name}
                            </p>
                            <p className="text-sm text-[#666666]">
                              {[closure.afterSales.phone, closure.afterSales.email]
                                .filter(Boolean)
                                .join(" | ") || "Contact details not provided."}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-[#666666]">
                            After-sales contact not assigned yet.
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-[#D9D9D9] p-3">
                          <p className="text-xs text-[#666666]">Handover Date</p>
                          <p className="text-[#333132] font-medium">
                            {formatDateValue(closure?.handoverDate)}
                          </p>
                        </div>
                        <div className="rounded-xl border border-[#D9D9D9] p-3">
                          <p className="text-xs text-[#666666]">
                            Post-Service Follow-up
                          </p>
                          <p className="text-[#333132] font-medium">
                            {formatDateValue(closure?.followupDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#666666]">
                    Project closure details not available yet.
                  </p>
                )}
                <div className="mt-6 p-4 rounded-xl bg-[#FFF] border border-[#D9D9D9] flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=600&auto=format&fit=crop"
                    alt="Cozy living room"
                    loading="lazy"
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <p className="text-sm text-[#333132]">
                    Thank you for choosing BUILDORA ENTERPRISE. We hope your new space
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
                      placeholder="Describe the issue..."
                      aria-label="Describe the issue..."
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
                          {selectedPayMilestone
                            ? formatCurrency(selectedPayMilestone.amount)
                            : "-"}
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
            </>,
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

