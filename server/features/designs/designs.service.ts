import * as repo from "./designs.repo";

export async function createDesign(data: repo.DesignCreateInput) {
  return repo.createDesign(data);
}

export async function updateDesign(id: string, data: Partial<repo.DesignCreateInput>) {
  return repo.updateDesign(id, data);
}

export async function getDesign(id: string) {
  return repo.getDesign(id);
}

export async function deleteDesign(id: string) {
  return repo.deleteDesign(id);
}

export async function listDesigns(params: { category?: string; style?: string; budget?: any; q?: string; page: number; pageSize: number; active?: boolean }) {
  return repo.listDesigns(params);
}

