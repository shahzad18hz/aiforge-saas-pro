import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { DashboardStats, IHistory, IUser, AdminStats } from "@/types";

// ─── User Stats ────────────────────────────────────────────────────────────
export function useStats() {
  return useQuery<DashboardStats>({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users/stats");
      return data.stats;
    },
    staleTime: 30_000,
  });
}

// ─── History ───────────────────────────────────────────────────────────────
export function useHistory(page = 1, toolType?: string) {
  return useQuery({
    queryKey: ["history", page, toolType],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (toolType) params.set("toolType", toolType);
      const { data } = await axios.get(`/api/users/history?${params}`);
      return data as { history: IHistory[]; pagination: { page: number; total: number; pages: number } };
    },
  });
}

export function useDeleteHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axios.delete("/api/users/history", { data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["history"] }); toast.success("Deleted"); },
    onError: () => toast.error("Delete failed"),
  });
}

// ─── Profile ───────────────────────────────────────────────────────────────
export function useProfile() {
  return useQuery<IUser>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users/profile");
      return data.user;
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<IUser>) => axios.patch("/api/users/profile", updates),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile"] }); toast.success("Profile updated"); },
    onError: () => toast.error("Update failed"),
  });
}

// ─── Admin ─────────────────────────────────────────────────────────────────
export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/stats");
      return data.stats;
    },
    staleTime: 60_000,
  });
}

export function useAdminUsers(page = 1, search = "") {
  return useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const { data } = await axios.get(`/api/admin/users?${params}`);
      return data as { users: IUser[]; pagination: { page: number; total: number; pages: number } };
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<IUser> }) =>
      axios.patch("/api/admin/users", { userId, updates }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("User updated"); },
    onError: () => toast.error("Update failed"),
  });
}

// ─── Generate ──────────────────────────────────────────────────────────────
export function useGenerate(toolPath: string) {
  const { update } = useSession();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: Record<string, unknown>) => {
      const { data } = await axios.post(`/api/generate/${toolPath}`, input);
      return data as { content: string; creditsUsed: number; creditsRemaining: number };
    },
    onSuccess: async (data) => {
      await update({ credits: data.creditsRemaining });
      qc.invalidateQueries({ queryKey: ["stats"] });
      qc.invalidateQueries({ queryKey: ["history"] });
      toast.success(`Generated! ${data.creditsUsed} credit${data.creditsUsed > 1 ? "s" : ""} used.`);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.error || "Generation failed";
        if (error.response?.status === 402) {
          toast.error("Not enough credits! Upgrade to Pro.", { action: { label: "Upgrade", onClick: () => window.location.href = "/dashboard/billing" } });
        } else {
          toast.error(msg);
        }
      }
    },
  });
}

// ─── Stripe ────────────────────────────────────────────────────────────────
export function useCheckout() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/stripe/checkout");
      return data.url as string;
    },
    onSuccess: (url) => window.location.href = url,
    onError: () => toast.error("Failed to open checkout"),
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/stripe/portal");
      return data.url as string;
    },
    onSuccess: (url) => window.location.href = url,
    onError: () => toast.error("Failed to open billing portal"),
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => axios.post("/api/stripe/cancel"),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile"] }); toast.success("Subscription will cancel at period end"); },
    onError: () => toast.error("Cancellation failed"),
  });
}
