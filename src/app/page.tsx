import { redirect } from "next/navigation";

/**
 * Root page — simply redirects to /dashboard.
 * The proxy will handle redirecting unauthenticated users to /login.
 */
export default function Home() {
  redirect("/dashboard");
}
