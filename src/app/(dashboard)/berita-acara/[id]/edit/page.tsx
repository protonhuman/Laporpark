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
    .select("role")
    .eq("id", authUser.id)
    .single();

  if (
    !profile ||
    (profile.role !== "carpark_manager" && profile.role !== "supervisor" && profile.role !== "admin")
  ) {
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

  return <EditBAForm ba={ba} userRole={profile.role} />;
}
