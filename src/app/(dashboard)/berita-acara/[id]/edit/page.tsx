import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditBAForm from "./edit-form";

export default async function EditBAPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Check user role — only manager and supervisor can edit
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role, kode_bandara")
    .eq("id", authUser.id)
    .single();

  const isAllowedRole =
    profile?.role === "superadmin" ||
    profile?.role === "carpark_manager" ||
    profile?.role === "supervisor";

  if (!profile || !isAllowedRole) {
    // Not authorized — redirect back to detail
    redirect(`/berita-acara/${id}`);
  }

  // Get BA data
  const { data: ba } = await supabase
    .from("berita_acara")
    .select("*")
    .eq("id", id)
    .single();

  if (!ba) notFound();

  // Isolasi Multi-Cabang: Cegah staf mengedit BA milik bandara lain
  if (profile.role !== "superadmin" && profile.kode_bandara !== ba.kode_bandara) {
    redirect(`/berita-acara/${id}`);
  }

  return <EditBAForm ba={ba} userRole={profile.role} />;
}
