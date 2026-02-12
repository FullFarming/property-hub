import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Building = Tables<"buildings">;
export type BuildingInsert = TablesInsert<"buildings">;
export type BuildingUpdate = TablesUpdate<"buildings">;

export function useBuildings() {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buildings")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Building[];
    },
  });
}

export function useBuilding(id: string | undefined) {
  return useQuery({
    queryKey: ["buildings", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buildings")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Building;
    },
  });
}

export function useCreateBuilding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (building: BuildingInsert) => {
      const { data, error } = await supabase
        .from("buildings")
        .insert(building)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["buildings"] }),
  });
}

export function useUpdateBuilding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: BuildingUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("buildings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["buildings"] }),
  });
}
