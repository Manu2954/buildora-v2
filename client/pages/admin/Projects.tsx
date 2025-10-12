
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import {
  listProjects,
  createProject,
  replaceProject,
  deleteProject,
} from "@/lib/projects";
import { listUsers, type UserSummary } from "@/lib/users";
import {
  PROJECT_STATUS_LABELS,
  type Project,
  type ProjectCreateInput,
  type ProjectStatus,
} from "@/lib/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SimpleProjectForm {
  id: string;
  customerId: string;
  address: string;
  type: string;
  status: ProjectStatus;
  startDate: string;
  eta: string;
  sitePhoto: string;
  discounts: string;
  extras: string;
  salesmanName: string;
  salesmanPhone: string;
  salesmanEmail: string;
  designerName: string;
  designerPhone: string;
  designerEmail: string;
  contractorName: string;
  contractorPhone: string;
  contractorEmail: string;
  quotationName: string;
  quotationUrl: string;
  invoicesJson: string;
  permitsJson: string;
  signoffsJson: string;
  materialsJson: string;
  milestonesJson: string;
  designsJson: string;
  worksiteMediaJson: string;
  closureHandoverDate: string;
  closureFollowupDate: string;
  closureCertificateName: string;
  closureCertificateUrl: string;
  closureWarrantyName: string;
  closureWarrantyUrl: string;
  closureAfterSalesName: string;
  closureAfterSalesPhone: string;
  closureAfterSalesEmail: string;
  closureFinalMediaJson: string;
}

const EMPTY_FORM: SimpleProjectForm = {
  id: "",
  customerId: "",
  address: "",
  type: "",
  status: "In Progress",
  startDate: "",
  eta: "",
  sitePhoto: "",
  discounts: "0",
  extras: "0",
  salesmanName: "",
  salesmanPhone: "",
  salesmanEmail: "",
  designerName: "",
  designerPhone: "",
  designerEmail: "",
  contractorName: "",
  contractorPhone: "",
  contractorEmail: "",
  quotationName: "",
  quotationUrl: "",
  invoicesJson: "[]",
  permitsJson: "[]",
  signoffsJson: "[]",
  materialsJson: "[]",
  milestonesJson: "[]",
  designsJson: "[]",
  worksiteMediaJson: "[]",
  closureHandoverDate: "",
  closureFollowupDate: "",
  closureCertificateName: "",
  closureCertificateUrl: "",
  closureWarrantyName: "",
  closureWarrantyUrl: "",
  closureAfterSalesName: "",
  closureAfterSalesPhone: "",
  closureAfterSalesEmail: "",
  closureFinalMediaJson: "[]",
};

const stringifySafe = (value: unknown) => JSON.stringify(value ?? [], null, 2);

const UNASSIGNED_VALUE = "__UNASSIGNED__";

const mapProjectToForm = (project: Project): SimpleProjectForm => ({
  id: project.id,
  customerId: project.customerId ?? "",
  address: project.address,
  type: project.type,
  status: project.status,
  startDate: project.startDate ?? "",
  eta: project.eta ?? "",
  sitePhoto: project.sitePhoto ?? "",
  discounts: String(project.discounts ?? 0),
  extras: String(project.extras ?? 0),
  salesmanName: project.salesman?.name ?? "",
  salesmanPhone: project.salesman?.phone ?? "",
  salesmanEmail: project.salesman?.email ?? "",
  designerName: project.designer?.name ?? "",
  designerPhone: project.designer?.phone ?? "",
  designerEmail: project.designer?.email ?? "",
  contractorName: project.contractor?.name ?? "",
  contractorPhone: project.contractor?.phone ?? "",
  contractorEmail: project.contractor?.email ?? "",
  quotationName: project.quotationFile?.name ?? "",
  quotationUrl: project.quotationFile?.url ?? "",
  invoicesJson: stringifySafe(project.invoices),
  permitsJson: stringifySafe(project.permits),
  signoffsJson: stringifySafe(project.signoffs),
  materialsJson: stringifySafe(project.materials),
  milestonesJson: stringifySafe(project.milestones),
  designsJson: stringifySafe(project.designs),
  worksiteMediaJson: stringifySafe(project.worksiteMedia),
  closureHandoverDate: project.closure?.handoverDate ?? "",
  closureFollowupDate: project.closure?.followupDate ?? "",
  closureCertificateName: project.closure?.certificate?.name ?? "",
  closureCertificateUrl: project.closure?.certificate?.url ?? "",
  closureWarrantyName: project.closure?.warranty?.name ?? "",
  closureWarrantyUrl: project.closure?.warranty?.url ?? "",
  closureAfterSalesName: project.closure?.afterSales?.name ?? "",
  closureAfterSalesPhone: project.closure?.afterSales?.phone ?? "",
  closureAfterSalesEmail: project.closure?.afterSales?.email ?? "",
  closureFinalMediaJson: stringifySafe(project.closure?.finalMedia),
});

const parseJsonArray = <T,>(label: string, value: string): T[] => {
  if (!value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      throw new Error(`${label} must be a JSON array`);
    }
    return parsed as T[];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Invalid JSON in ${label}`;
    throw new Error(message);
  }
};

const parseFloatOr = (value: string, fallback = 0) => {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : fallback;
};

const buildPayload = (form: SimpleProjectForm): ProjectCreateInput => {
  const invoices = parseJsonArray<{ name: string; url: string }>(
    "Invoices",
    form.invoicesJson,
  );
  const permits = parseJsonArray<{ name: string; url: string }>(
    "Permits",
    form.permitsJson,
  );
  const signoffs = parseJsonArray<{ name: string; url: string }>(
    "Sign-offs",
    form.signoffsJson,
  );
  const materials = parseJsonArray<{
    id?: string;
    type: string;
    brand?: string;
    qty?: string;
    status?: string;
  }>("Materials", form.materialsJson);
  const milestones = parseJsonArray<{
    id?: string;
    label: string;
    amount: number;
    status?: string;
    approved?: boolean;
    dueDate?: string;
  }>("Milestones", form.milestonesJson);
  const designs = parseJsonArray<{
    id?: string;
    url: string;
    title?: string;
  }>("Designs", form.designsJson);
  const worksiteMedia = parseJsonArray<{
    id?: string;
    kind: string;
    url: string;
    caption?: string;
  }>("Worksite media", form.worksiteMediaJson);
  const closureFinalMedia = parseJsonArray<{
    id?: string;
    kind: string;
    url: string;
    caption?: string;
  }>("Closure media", form.closureFinalMediaJson);

  const salesman =
    form.salesmanName || form.salesmanPhone || form.salesmanEmail
      ? {
          name: form.salesmanName,
          phone: form.salesmanPhone || undefined,
          email: form.salesmanEmail || undefined,
        }
      : undefined;

  const designer =
    form.designerName || form.designerPhone || form.designerEmail
      ? {
          name: form.designerName,
          phone: form.designerPhone || undefined,
          email: form.designerEmail || undefined,
        }
      : undefined;

  const contractor =
    form.contractorName || form.contractorPhone || form.contractorEmail
      ? {
          name: form.contractorName,
          phone: form.contractorPhone || undefined,
          email: form.contractorEmail || undefined,
        }
      : undefined;

  const quotationFile =
    form.quotationName && form.quotationUrl
      ? { name: form.quotationName, url: form.quotationUrl }
      : undefined;

  const closure =
    form.closureHandoverDate ||
    form.closureFollowupDate ||
    form.closureCertificateName ||
    form.closureCertificateUrl ||
    form.closureWarrantyName ||
    form.closureWarrantyUrl ||
    form.closureAfterSalesName ||
    form.closureAfterSalesPhone ||
    form.closureAfterSalesEmail ||
    closureFinalMedia.length
      ? {
          handoverDate: form.closureHandoverDate || undefined,
          followupDate: form.closureFollowupDate || undefined,
          certificate:
            form.closureCertificateName && form.closureCertificateUrl
              ? {
                  name: form.closureCertificateName,
                  url: form.closureCertificateUrl,
                }
              : undefined,
          warranty:
            form.closureWarrantyName && form.closureWarrantyUrl
              ? {
                  name: form.closureWarrantyName,
                  url: form.closureWarrantyUrl,
                }
              : undefined,
          afterSales:
            form.closureAfterSalesName ||
            form.closureAfterSalesPhone ||
            form.closureAfterSalesEmail
              ? {
                  name: form.closureAfterSalesName || "After Sales",
                  phone: form.closureAfterSalesPhone || undefined,
                  email: form.closureAfterSalesEmail || undefined,
                }
              : undefined,
          finalMedia: closureFinalMedia as any,
        }
      : undefined;

  const payload: ProjectCreateInput = {
    id: form.id.trim() || undefined,
    customerId: form.customerId.trim() || undefined,
    address: form.address.trim(),
    type: form.type.trim(),
    status: form.status,
    startDate: form.startDate || undefined,
    eta: form.eta || undefined,
    sitePhoto: form.sitePhoto.trim() || undefined,
    discounts: parseFloatOr(form.discounts, 0),
    extras: parseFloatOr(form.extras, 0),
    salesman,
    designer,
    contractor,
    quotationFile,
    invoices,
    permits,
    signoffs,
    materials: materials as any,
    milestones: milestones as any,
    designs: designs as any,
    worksiteMedia: worksiteMedia as any,
    closure,
  };

  return payload;
};

type Mode = "create" | "edit";

export default function AdminProjects() {
  const [search, setSearch] = useState("");
  const [formState, setFormState] = useState<SimpleProjectForm>(EMPTY_FORM);
  const [mode, setMode] = useState<Mode>("create");
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: customersData,
    isLoading: customersLoading,
    error: customersError,
  } = useQuery({
    queryKey: ["admin", "users", "customers"],
    queryFn: () => listUsers({ role: "CUSTOMER" }),
    staleTime: 60_000,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => listProjects({ page: 1, pageSize: 50 }),
    staleTime: 30_000,
  });

  const projects = data?.items ?? [];
  const customers = customersData?.users ?? [];
  const customerOptions = useMemo(() => {
    return [...customers].sort((a, b) => a.email.localeCompare(b.email));
  }, [customers]);
  const fallbackCustomerOption = useMemo<UserSummary | undefined>(() => {
    if (!formState.customerId) return undefined;
    if (customers.some((customer) => customer.id === formState.customerId)) {
      return undefined;
    }
    const projectMatch = projects.find(
      (project) => project.id === formState.id,
    )?.customer;
    if (projectMatch && projectMatch.id === formState.customerId) {
      return {
        id: projectMatch.id,
        email: projectMatch.email,
        role: projectMatch.role,
      };
    }
    return undefined;
  }, [customers, formState.customerId, formState.id, projects]);
  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (project) =>
        project.id.toLowerCase().includes(q) ||
        project.address.toLowerCase().includes(q) ||
        project.type.toLowerCase().includes(q) ||
        project.status.toLowerCase().includes(q),
    );
  }, [projects, search]);

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      toast.success(`Project ${project.id} created successfully.`);
      setDialogOpen(false);
      setFormState(EMPTY_FORM);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to create project");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProjectCreateInput }) =>
      replaceProject(id, payload),
    onSuccess: (project) => {
      toast.success(`Project ${project.id} updated successfully.`);
      setDialogOpen(false);
      setFormState(EMPTY_FORM);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to update project");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      toast.success("Project deleted.");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to delete project");
    },
  });

  const openCreate = () => {
    setFormState(EMPTY_FORM);
    setMode("create");
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setFormState(mapProjectToForm(project));
    setMode("edit");
    setDialogOpen(true);
  };

  const submitForm = () => {
    try {
      const payload = buildPayload(formState);
      if (!payload.address || !payload.type) {
        toast.error("Address and project type are required.");
        return;
      }
      if (mode === "create") {
        createMutation.mutate(payload);
      } else {
        const id = formState.id.trim();
        if (!id) {
          toast.error("Project ID is required when editing.");
          return;
        }
        updateMutation.mutate({ id, payload });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid form data");
    }
  };

  const pending = createMutation.isPending || updateMutation.isPending;

  const handleDelete = (project: Project) => {
    if (deleteMutation.isPending) return;
    const confirmed = window.confirm(
      `Delete project ${project.id}? This cannot be undone.`,
    );
    if (!confirmed) return;
    deleteMutation.mutate(project.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#333132]">
            Project Catalogue
          </h1>
          <p className="text-sm text-[#666666]">
            Create and maintain projects that power the customer experience.
          </p>
        </div>
        <Button
          className="rounded-xl bg-[#C69B4B] hover:bg-[#B1873E]"
          onClick={openCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by ID, status, address, or type"
          className="rounded-xl sm:max-w-xs"
        />
        <div className="text-sm text-[#666666]">
          Showing {filteredProjects.length} of {projects.length}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-[#666666]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading projects…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-[#F5D0D0] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]">
          <p className="font-medium">Unable to load projects.</p>
          <p className="mt-1 text-[#7F1D1D]">
            Please try again in a moment or refresh the page.
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D9D9D9] bg-white p-8 text-center text-sm text-[#666666]">
          No projects matched your search.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#D9D9D9] bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-[#F7F4EE] text-[#333132]">
              <TableRow>
                <TableHead className="w-[120px]">Project ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium text-[#333132]">
                    {project.id}
                  </TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.type}</TableCell>
                  <TableCell>{project.startDate ?? "–"}</TableCell>
                  <TableCell>{project.eta ?? "–"}</TableCell>
                  <TableCell>{project.customer?.email ?? "—"}</TableCell>
                  <TableCell className="max-w-[320px] truncate">
                    {project.address}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="rounded-xl border-[#D9D9D9]"
                        onClick={() => openEdit(project)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-xl"
                        onClick={() => handleDelete(project)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create Project" : `Edit ${formState.id}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pb-4">
            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project-id">Project ID (optional)</Label>
                <Input
                  id="project-id"
                  value={formState.id}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      id: event.target.value.toUpperCase(),
                    }))
                  }
                  disabled={mode === "edit"}
                  placeholder="e.g. BE-12345"
                  className="rounded-xl"
                />
                <p className="text-xs text-[#666666]">
                  Leave blank to auto-generate an ID.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-customer">Assigned Customer</Label>
                <Select
                  value={formState.customerId || UNASSIGNED_VALUE}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      customerId:
                        value === UNASSIGNED_VALUE ? "" : value,
                    }))
                  }
                  disabled={pending || customersLoading}
                >
                  <SelectTrigger
                    id="project-customer"
                    className="rounded-xl"
                  >
                    <SelectValue
                      placeholder={
                        customersLoading
                          ? "Loading customers..."
                          : "Select a customer (optional)"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UNASSIGNED_VALUE}>
                      Unassigned
                    </SelectItem>
                    {customerOptions.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.email}
                      </SelectItem>
                    ))}
                    {fallbackCustomerOption && (
                      <SelectItem value={fallbackCustomerOption.id}>
                        {fallbackCustomerOption.email}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {customersError ? (
                  <p className="text-xs text-[#991B1B]">
                    Unable to load customers. Please try again later.
                  </p>
                ) : (
                  <p className="text-xs text-[#666666]">
                    Leave unassigned to create the project without linking a
                    customer.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-type">Project Type</Label>
                <Input
                  id="project-type"
                  value={formState.type}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, type: event.target.value }))
                  }
                  placeholder="Apartment, Villa, Commercial…"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-status">Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      status: value as ProjectStatus,
                    }))
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUS_LABELS.map((statusValue) => (
                      <SelectItem key={statusValue} value={statusValue}>
                        {statusValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="project-address">Site Address</Label>
                <Textarea
                  id="project-address"
                  value={formState.address}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                  rows={3}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-start">Start Date</Label>
                <Input
                  id="project-start"
                  type="date"
                  value={formState.startDate}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      startDate: event.target.value,
                    }))
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-eta">Estimated Completion</Label>
                <Input
                  id="project-eta"
                  type="date"
                  value={formState.eta}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      eta: event.target.value,
                    }))
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-photo">Site Photo URL</Label>
                <Input
                  id="project-photo"
                  value={formState.sitePhoto}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      sitePhoto: event.target.value,
                    }))
                  }
                  placeholder="https://"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="project-discounts">Discounts</Label>
                  <Input
                    id="project-discounts"
                    type="number"
                    min={0}
                    value={formState.discounts}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        discounts: event.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-extras">Extras</Label>
                  <Input
                    id="project-extras"
                    type="number"
                    min={0}
                    value={formState.extras}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        extras: event.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Sales Manager",
                  name: "salesmanName",
                  phone: "salesmanPhone",
                  email: "salesmanEmail",
                },
                {
                  label: "Designer / Architect",
                  name: "designerName",
                  phone: "designerPhone",
                  email: "designerEmail",
                },
                {
                  label: "Contractor",
                  name: "contractorName",
                  phone: "contractorPhone",
                  email: "contractorEmail",
                },
              ].map((contact) => (
                <div
                  key={contact.name}
                  className="space-y-3 rounded-2xl border border-[#E4E4E4] p-4"
                >
                  <h3 className="text-sm font-semibold text-[#333132]">
                    {contact.label}
                  </h3>
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={formState[contact.name as keyof SimpleProjectForm] as string}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          [contact.name]: event.target.value,
                        }))
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formState[contact.phone as keyof SimpleProjectForm] as string}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          [contact.phone]: event.target.value,
                        }))
                      }
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formState[contact.email as keyof SimpleProjectForm] as string}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          [contact.email]: event.target.value,
                        }))
                      }
                      className="rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-[#E4E4E4] p-4">
                <h3 className="text-sm font-semibold text-[#333132]">
                  Quotation File
                </h3>
                <Label>Name</Label>
                <Input
                  value={formState.quotationName}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      quotationName: event.target.value,
                    }))
                  }
                  className="rounded-xl"
                />
                <Label className="mt-3">URL</Label>
                <Input
                  value={formState.quotationUrl}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      quotationUrl: event.target.value,
                    }))
                  }
                  placeholder="https://"
                  className="rounded-xl"
                />
              </div>

              {[
                { label: "Invoices", key: "invoicesJson" },
                { label: "Permits", key: "permitsJson" },
                { label: "Sign-offs", key: "signoffsJson" },
              ].map((section) => (
                <div
                  key={section.key}
                  className="space-y-2 rounded-2xl border border-[#E4E4E4] p-4"
                >
                  <h3 className="text-sm font-semibold text-[#333132]">
                    {section.label} (JSON array)
                  </h3>
                  <Textarea
                    rows={6}
                    value={formState[section.key as keyof SimpleProjectForm] as string}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        [section.key]: event.target.value,
                      }))
                    }
                    className="rounded-xl font-mono text-xs"
                  />
                </div>
              ))}
            </section>

            {[
              { label: "Materials (JSON array)", key: "materialsJson" },
              { label: "Milestones (JSON array)", key: "milestonesJson" },
              { label: "Designs (JSON array)", key: "designsJson" },
              { label: "Worksite Media (JSON array)", key: "worksiteMediaJson" },
            ].map((section) => (
              <div
                key={section.key}
                className="space-y-2 rounded-2xl border border-[#E4E4E4] p-4"
              >
                <h3 className="text-sm font-semibold text-[#333132]">
                  {section.label}
                </h3>
                <Textarea
                  rows={6}
                  value={formState[section.key as keyof SimpleProjectForm] as string}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      [section.key]: event.target.value,
                    }))
                  }
                  className="rounded-xl font-mono text-xs"
                />
                <p className="text-xs text-[#666666]">
                  Example: [{'{'}"label":"Advance","amount":200000,"status":"Paid","approved":true{'}'}]
                </p>
              </div>
            ))}

            <section className="rounded-2xl border border-[#E4E4E4] p-4 space-y-4">
              <h3 className="text-sm font-semibold text-[#333132]">
                Project Closure
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Handover Date</Label>
                  <Input
                    type="date"
                    value={formState.closureHandoverDate}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        closureHandoverDate: event.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Follow-up Date</Label>
                  <Input
                    type="date"
                    value={formState.closureFollowupDate}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        closureFollowupDate: event.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Certificate Name</Label>
                  <Input
                    value={formState.closureCertificateName}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        closureCertificateName: event.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Certificate URL</Label>
                  <Input
                    value={formState.closureCertificateUrl}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        closureCertificateUrl: event.target.value,
                      }))
                    }
                    placeholder="https://"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Warranty Name</Label>
                  <Input
                    value={formState.closureWarrantyName}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        closureWarrantyName: event.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Warranty URL</Label>
                  <Input
                    value={formState.closureWarrantyUrl}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        closureWarrantyUrl: event.target.value,
                      }))
                    }
                    placeholder="https://"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>After-sales Name</Label>
                  <Input
                    value={formState.closureAfterSalesName}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        closureAfterSalesName: event.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>After-sales Phone</Label>
                  <Input
                    value={formState.closureAfterSalesPhone}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        closureAfterSalesPhone: event.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>After-sales Email</Label>
                  <Input
                    type="email"
                    value={formState.closureAfterSalesEmail}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        closureAfterSalesEmail: event.target.value,
                      }))
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Final Media (JSON array)</Label>
                <Textarea
                  rows={5}
                  value={formState.closureFinalMediaJson}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      closureFinalMediaJson: event.target.value,
                    }))
                  }
                  className="rounded-xl font-mono text-xs"
                />
              </div>
            </section>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setDialogOpen(false);
                  setFormState(EMPTY_FORM);
                }}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                className="rounded-xl bg-[#C69B4B] hover:bg-[#B1873E]"
                onClick={submitForm}
                disabled={pending}
              >
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Project" : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

