import { SessionProvider } from "@/components/providers/SessionProvider";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
