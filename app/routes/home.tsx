import { data, redirect, useFetcher, useNavigate } from 'react-router';
import { Login } from '~/components/login/login';

import {
  getSession,
  commitSession,
} from "~/sessions.server";
import { Route } from './+types/home';
import AuthUser from '~/types/authUser';


export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  console.log("session has user", (session.has("user") && session.get("user")?.uid));

  if (session.has("user") && session.get("user")?.uid) {
    // Redirect to the home page if they are already signed in.
    return redirect("/dashboard");
  }

  return data(
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

//login action
export async function action({
  request,
}: Route.ActionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  const form = await request.formData();
  const user: AuthUser = {
    uid: form.get("displayName")?.toString() || "",
    displayName: form.get("displayName")?.toString() || null,
    email: form.get("displayName")?.toString() || null,
  };

  session.set("user", user);

  // Login succeeded, send them to the home page.
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Home({
  
}: Route.ComponentProps) {
  const fetcher = useFetcher();

  function saveLogin(user: AuthUser){
    const f = new FormData();
    f.append("uid", user.uid);
    f.append("displayName", user.displayName || "");
    f.append("email", user.email || "");
    fetcher.submit(f, { method: 'POST'});
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome, please login or signup</h1>
      <div className="mt-4 w-full max-w-md">
        <Login action={saveLogin} />
      </div>
    </div>
  );
}
