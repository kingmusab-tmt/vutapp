import { useSession } from "next-auth/react";

export default async function Page() {
  const { data: session} = useSession();
  if (!session) return <div>Not authenticated</div>

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}