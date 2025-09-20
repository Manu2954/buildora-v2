import * as repo from "./projects.repo";

export async function createProject(customerId: string, data: { orderId?: string; siteLocation?: string; salespersonId?: string; designerId?: string; contractor?: string; startDate?: string; eta?: string; comments?: string; status?: any }) {
  return repo.createProject(customerId, {
    orderId: data.orderId,
    siteLocation: data.siteLocation,
    salespersonId: data.salespersonId,
    designerId: data.designerId,
    contractor: data.contractor,
    startDate: data.startDate ? new Date(data.startDate) : null,
    eta: data.eta ? new Date(data.eta) : null,
    comments: data.comments,
    status: data.status,
  });
}

export async function updateProject(id: string, data: Partial<{ siteLocation: string; salespersonId: string; designerId: string; contractor: string; startDate?: string; eta?: string; comments: string; status: any; mediaUploads: any[]; permits: any[]; signOffs: any[]; handoverData: any; rating?: number; feedback?: string; supportContact?: string }>) {
  return repo.updateProject(id, {
    siteLocation: data.siteLocation!,
    salespersonId: data.salespersonId!,
    designerId: data.designerId!,
    contractor: data.contractor!,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    eta: data.eta ? new Date(data.eta) : undefined,
    comments: data.comments!,
    status: data.status,
    mediaUploads: data.mediaUploads,
    permits: data.permits,
    signOffs: data.signOffs,
    handoverData: data.handoverData,
    rating: data.rating,
    feedback: data.feedback,
    supportContact: data.supportContact,
  });
}

export async function getMyProject(userId: string, id: string) {
  return repo.getProjectForUser(id, userId);
}

export async function listMyProjects(userId: string, page: number, pageSize: number) {
  return repo.listProjectsForUser(userId, page, pageSize);
}

export async function listProjectsAdmin(page: number, pageSize: number) {
  return repo.listProjectsAdmin(page, pageSize);
}

export async function getProjectAdmin(id: string) {
  return repo.getProjectAdmin(id);
}

