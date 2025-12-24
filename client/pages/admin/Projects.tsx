
import { useMemo, useRef, useState } from "react";
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
  type FileRef,
  type DesignAssetInput,
  type MediaAssetInput,
} from "@/lib/types/project";
import { uploadFile, type UploadedFile } from "@/lib/files";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  quotationFile: FileRef | null;
  invoices: FileRef[];
  permits: FileRef[];
  signoffs: FileRef[];
  materialsJson: string;
  milestonesJson: string;
  designs: DesignAssetInput[];
  worksiteMedia: MediaAssetInput[];
  closureHandoverDate: string;
  closureFollowupDate: string;
  closureCertificateName: string;
  closureCertificateUrl: string;
  closureWarrantyName: string;
  closureWarrantyUrl: string;
  closureAfterSalesName: string;
  closureAfterSalesPhone: string;
  closureAfterSalesEmail: string;
  closureFinalMedia: MediaAssetInput[];
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
  quotationFile: null,
  invoices: [],
  permits: [],
  signoffs: [],
  materialsJson: "[]",
  milestonesJson: "[]",
  designs: [],
  worksiteMedia: [],
  closureHandoverDate: "",
  closureFollowupDate: "",
  closureCertificateName: "",
  closureCertificateUrl: "",
  closureWarrantyName: "",
  closureWarrantyUrl: "",
  closureAfterSalesName: "",
  closureAfterSalesPhone: "",
  closureAfterSalesEmail: "",
  closureFinalMedia: [],
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
  quotationFile: project.quotationFile
    ? { name: project.quotationFile.name, url: project.quotationFile.url }
    : null,
  invoices: project.invoices?.map((file) => ({ ...file })) ?? [],
  permits: project.permits?.map((file) => ({ ...file })) ?? [],
  signoffs: project.signoffs?.map((file) => ({ ...file })) ?? [],
  materialsJson: stringifySafe(project.materials),
  milestonesJson: stringifySafe(project.milestones),
  designs:
    project.designs?.map((design) => ({
      id: design.id,
      url: design.url,
      title: design.title,
    })) ?? [],
  worksiteMedia:
    project.worksiteMedia?.map((media) => ({
      id: media.id,
      kind: media.kind,
      url: media.url,
      caption: media.caption,
    })) ?? [],
  closureHandoverDate: project.closure?.handoverDate ?? "",
  closureFollowupDate: project.closure?.followupDate ?? "",
  closureCertificateName: project.closure?.certificate?.name ?? "",
  closureCertificateUrl: project.closure?.certificate?.url ?? "",
  closureWarrantyName: project.closure?.warranty?.name ?? "",
  closureWarrantyUrl: project.closure?.warranty?.url ?? "",
  closureAfterSalesName: project.closure?.afterSales?.name ?? "",
  closureAfterSalesPhone: project.closure?.afterSales?.phone ?? "",
  closureAfterSalesEmail: project.closure?.afterSales?.email ?? "",
  closureFinalMedia:
    project.closure?.finalMedia?.map((media) => ({
      id: media.id,
      kind: media.kind,
      url: media.url,
      caption: media.caption,
    })) ?? [],
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

const extractNameFromUrl = (url: string) => {
  const parts = url.split("/");
  const last = parts[parts.length - 1] || "file";
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
};

const stripExtension = (name: string) => {
  const index = name.lastIndexOf(".");
  if (index <= 0) return name;
  return name.slice(0, index);
};

const cleanFileRefs = (files: FileRef[]): FileRef[] =>
  files
    .map((file) => {
      const url = file.url?.trim();
      if (!url) return null;
      const name = file.name?.trim() || extractNameFromUrl(url);
      return { name, url };
    })
    .filter((file): file is FileRef => file !== null);

const cleanDesigns = (designs: DesignAssetInput[]): DesignAssetInput[] =>
  designs
    .map((design) => {
      const url = design.url?.trim();
      if (!url) return null;
      const title = design.title?.trim();
      return {
        ...(design.id ? { id: design.id } : {}),
        url,
        ...(title ? { title } : {}),
      };
    })
    .filter((design): design is DesignAssetInput => design !== null);

const cleanMediaAssets = (media: MediaAssetInput[]): MediaAssetInput[] =>
  media
    .map((item) => {
      const url = item.url?.trim();
      if (!url) return null;
      const kind: MediaAssetInput["kind"] =
        item.kind === "video" ? "video" : "image";
      const caption = item.caption?.trim();
      return {
        ...(item.id ? { id: item.id } : {}),
        url,
        kind,
        ...(caption ? { caption } : {}),
      };
    })
    .filter((item): item is MediaAssetInput => item !== null);

const uploadedToFileRef = (uploaded: UploadedFile): FileRef => ({
  name: uploaded.name,
  url: uploaded.url,
});

const uploadedToDesign = (uploaded: UploadedFile): DesignAssetInput => ({
  url: uploaded.url,
  title: stripExtension(uploaded.name),
});

const uploadedToMedia = (uploaded: UploadedFile): MediaAssetInput => ({
  url: uploaded.url,
  kind: uploaded.mimeType.startsWith("video/") ? "video" : "image",
  caption: stripExtension(uploaded.name),
});

const buildPayload = (form: SimpleProjectForm): ProjectCreateInput => {
  const invoices = cleanFileRefs(form.invoices);
  const permits = cleanFileRefs(form.permits);
  const signoffs = cleanFileRefs(form.signoffs);
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
  const designs = cleanDesigns(form.designs);
  const worksiteMedia = cleanMediaAssets(form.worksiteMedia);
  const closureFinalMedia = cleanMediaAssets(form.closureFinalMedia);

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
    form.quotationFile && form.quotationFile.url
      ? {
          name:
            form.quotationFile.name?.trim() ||
            extractNameFromUrl(form.quotationFile.url),
          url: form.quotationFile.url.trim(),
        }
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
          finalMedia: closureFinalMedia,
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
  const [uploading, setUploading] = useState(false);
  const quotationFileInputRef = useRef<HTMLInputElement | null>(null);

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

  const performUpload = async (
    files: FileList | null,
    onSuccess: (uploaded: UploadedFile[]) => void,
  ) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => uploadFile(file)),
      );
      onSuccess(uploaded);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload file";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  type FileRefKey = "invoices" | "permits" | "signoffs";
  const appendFileRefs = (key: FileRefKey, items: FileRef[]) => {
    if (items.length === 0) return;
    setFormState((prev) => ({
      ...prev,
      [key]: [...prev[key], ...items],
    }));
  };

  const updateFileRefAt = (key: FileRefKey, index: number, name: string) => {
    setFormState((prev) => {
      const next = [...prev[key]];
      if (!next[index]) return prev;
      next[index] = { ...next[index], name };
      return { ...prev, [key]: next };
    });
  };

  const removeFileRefAt = (key: FileRefKey, index: number) => {
    setFormState((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, idx) => idx !== index),
    }));
  };

  const handleFileRefUpload =
    (key: FileRefKey) => (files: FileList | null) => {
      void performUpload(files, (uploaded) =>
        appendFileRefs(key, uploaded.map(uploadedToFileRef)),
      );
    };

  const handleDesignsUpload = (files: FileList | null) => {
    void performUpload(files, (uploaded) =>
      setFormState((prev) => ({
        ...prev,
        designs: [...prev.designs, ...uploaded.map(uploadedToDesign)],
      })),
    );
  };

  const updateDesignTitle = (index: number, title: string) => {
    setFormState((prev) => {
      const next = [...prev.designs];
      if (!next[index]) return prev;
      next[index] = { ...next[index], title };
      return { ...prev, designs: next };
    });
  };

  const removeDesignAt = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      designs: prev.designs.filter((_, idx) => idx !== index),
    }));
  };

  type MediaKey = "worksiteMedia" | "closureFinalMedia";
  const appendMedia = (key: MediaKey, items: MediaAssetInput[]) => {
    if (items.length === 0) return;
    setFormState((prev) => ({
      ...prev,
      [key]: [...prev[key], ...items],
    }));
  };

  const handleMediaUpload =
    (key: MediaKey) => (files: FileList | null) => {
      void performUpload(files, (uploaded) =>
        appendMedia(key, uploaded.map(uploadedToMedia)),
      );
    };

  const updateMediaCaption = (key: MediaKey, index: number, caption: string) => {
    setFormState((prev) => {
      const next = [...prev[key]];
      if (!next[index]) return prev;
      next[index] = { ...next[index], caption };
      return { ...prev, [key]: next };
    });
  };

  const removeMediaAt = (key: MediaKey, index: number) => {
    setFormState((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, idx) => idx !== index),
    }));
  };

  const handleQuotationUpload = (files: FileList | null) => {
    void performUpload(files, (uploaded) => {
      const first = uploaded[0];
      if (!first) return;
      setFormState((prev) => ({
        ...prev,
        quotationFile: uploadedToFileRef(first),
      }));
    });
  };
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

  const pending =
    createMutation.isPending || updateMutation.isPending || uploading;
  const documentSections: Array<{ key: FileRefKey; label: string }> = [
    { key: "invoices", label: "Invoices" },
    { key: "permits", label: "Permits" },
    { key: "signoffs", label: "Sign-offs" },
  ];

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
              <div className="space-y-3 rounded-2xl border border-[#E4E4E4] p-4">
                <h3 className="text-sm font-semibold text-[#333132]">
                  Quotation File
                </h3>
                {formState.quotationFile ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-[#666666]">
                        Display Name
                      </Label>
                      <Input
                        value={formState.quotationFile.name}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            quotationFile: prev.quotationFile
                              ? { ...prev.quotationFile, name: event.target.value }
                              : prev.quotationFile,
                          }))
                        }
                        className="rounded-xl"
                        disabled={pending}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={formState.quotationFile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => quotationFileInputRef.current?.click()}
                        disabled={pending}
                      >
                        Replace
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            quotationFile: null,
                          }))
                        }
                        disabled={pending}
                      >
                        Remove
                      </Button>
                    </div>
                    <Input
                      ref={quotationFileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(event) => {
                        handleQuotationUpload(event.target.files);
                        event.target.value = "";
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-xs text-[#666666]">
                      Upload new file
                    </Label>
                    <Input
                      type="file"
                      onChange={(event) => {
                        handleQuotationUpload(event.target.files);
                        event.target.value = "";
                      }}
                      disabled={pending}
                      className="rounded-xl"
                    />
                    <p className="text-xs text-[#666666]">
                      Upload the latest quotation document (PDF, image, etc). Uploading a new file will replace the existing one.
                    </p>
                  </div>
                )}
              </div>

              {documentSections.map((section) => {
                const files = formState[section.key];
                const uploadFn = handleFileRefUpload(section.key);
                return (
                  <div
                    key={section.key}
                    className="space-y-3 rounded-2xl border border-[#E4E4E4] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#333132]">
                        {section.label}
                      </h3>
                      <Input
                        type="file"
                        multiple
                        onChange={(event) => {
                          uploadFn(event.target.files);
                          event.target.value = "";
                        }}
                        disabled={pending}
                        className="w-auto rounded-xl text-sm"
                      />
                    </div>
                    <p className="text-xs text-[#666666]">
                      Upload one or more files. Use the name field to control how it appears to customers.
                    </p>
                    <div className="space-y-2">
                      {files.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#D9D9D9] p-3 text-xs text-[#666666]">
                          No files uploaded yet.
                        </div>
                      ) : (
                        files.map((file, index) => (
                          <div
                            key={`${file.url}-${index}`}
                            className="space-y-2 rounded-xl border border-[#E4E4E4] p-3"
                          >
                            <Input
                              value={file.name}
                              onChange={(event) =>
                                updateFileRefAt(section.key, index, event.target.value)
                              }
                              className="rounded-xl"
                              disabled={pending}
                            />
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFileRefAt(section.key, index)}
                                disabled={pending}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </section>

            {[
              { label: "Materials (JSON array)", key: "materialsJson" },
              { label: "Milestones (JSON array)", key: "milestonesJson" },
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-[#E4E4E4] p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#333132]">
                    Designs
                  </h3>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => {
                      handleDesignsUpload(event.target.files);
                      event.target.value = "";
                    }}
                    disabled={pending}
                    className="w-auto rounded-xl text-sm"
                  />
                </div>
                <p className="text-xs text-[#666666]">
                  Upload design renders or references. Update the title to control
                  how it appears to customers.
                </p>
                <div className="space-y-3">
                  {formState.designs.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#D9D9D9] p-3 text-xs text-[#666666]">
                      No designs uploaded yet.
                    </div>
                  ) : (
                    formState.designs.map((design, index) => {
                      const designKey = design.id ?? `${design.url}-${index}`;
                      const displayName =
                        design.title?.trim() || extractNameFromUrl(design.url);
                      return (
                        <div
                          key={designKey}
                          className="space-y-2 rounded-xl border border-[#E4E4E4] p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-[#333132] truncate">
                              {displayName}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={design.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDesignAt(index)}
                                disabled={pending}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[#666666]">Title</Label>
                            <Input
                              value={design.title ?? ""}
                              onChange={(event) =>
                                updateDesignTitle(index, event.target.value)
                              }
                              className="rounded-xl"
                              disabled={pending}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-[#E4E4E4] p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#333132]">
                    Worksite Media
                  </h3>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(event) => {
                      handleMediaUpload("worksiteMedia")(event.target.files);
                      event.target.value = "";
                    }}
                    disabled={pending}
                    className="w-auto rounded-xl text-sm"
                  />
                </div>
                <p className="text-xs text-[#666666]">
                  Upload photos or videos captured during project execution.
                </p>
                <div className="space-y-3">
                  {formState.worksiteMedia.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#D9D9D9] p-3 text-xs text-[#666666]">
                      No worksite media uploaded yet.
                    </div>
                  ) : (
                    formState.worksiteMedia.map((media, index) => {
                      const mediaKey = media.id ?? `${media.url}-${index}`;
                      const displayName =
                        media.caption?.trim() || extractNameFromUrl(media.url);
                      return (
                        <div
                          key={mediaKey}
                          className="space-y-2 rounded-xl border border-[#E4E4E4] p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="capitalize border-[#D9D9D9] text-xs"
                              >
                                {media.kind}
                              </Badge>
                              <span className="text-sm font-medium text-[#333132] truncate">
                                {displayName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={media.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMediaAt("worksiteMedia", index)}
                                disabled={pending}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[#666666]">
                              Caption
                            </Label>
                            <Input
                              value={media.caption ?? ""}
                              onChange={(event) =>
                                updateMediaCaption(
                                  "worksiteMedia",
                                  index,
                                  event.target.value,
                                )
                              }
                              className="rounded-xl"
                              disabled={pending}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

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
                <div className="flex items-center justify-between gap-2">
                  <Label>Final Media Uploads</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(event) => {
                      handleMediaUpload("closureFinalMedia")(event.target.files);
                      event.target.value = "";
                    }}
                    disabled={pending}
                    className="w-auto rounded-xl text-sm"
                  />
                </div>
                <p className="text-xs text-[#666666]">
                  Upload the final media shared with the customer after project
                  completion.
                </p>
                <div className="space-y-3">
                  {formState.closureFinalMedia.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#D9D9D9] p-3 text-xs text-[#666666]">
                      No final media uploaded yet.
                    </div>
                  ) : (
                    formState.closureFinalMedia.map((media, index) => {
                      const mediaKey = media.id ?? `${media.url}-${index}`;
                      const displayName =
                        media.caption?.trim() || extractNameFromUrl(media.url);
                      return (
                        <div
                          key={mediaKey}
                          className="space-y-2 rounded-xl border border-[#E4E4E4] p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="capitalize border-[#D9D9D9] text-xs"
                              >
                                {media.kind}
                              </Badge>
                              <span className="text-sm font-medium text-[#333132] truncate">
                                {displayName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={media.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeMediaAt("closureFinalMedia", index)
                                }
                                disabled={pending}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[#666666]">
                              Caption
                            </Label>
                            <Input
                              value={media.caption ?? ""}
                              onChange={(event) =>
                                updateMediaCaption(
                                  "closureFinalMedia",
                                  index,
                                  event.target.value,
                                )
                              }
                              className="rounded-xl"
                              disabled={pending}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
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

