import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("user_session");

  // Redirect to dashboard if logged in, otherwise to login page
  if (isLoggedIn) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
