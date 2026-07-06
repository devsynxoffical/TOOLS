import { SessionProvider } from "@/components/providers/SessionProvider";

export const dynamic = "force-dynamic";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
