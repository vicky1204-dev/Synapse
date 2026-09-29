import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle,#b0a8b8_1px,transparent_1px)] dark:bg-[radial-gradient(circle,#ffffff1a_1px,transparent_1px)] bg-size-[10px_10px]">
      {/* Top bar */}
      <header className="flex items-center px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/synapse_logo.svg"
            alt="Synapse"
            width={24}
            height={24}
            className="size-6 shrink-0"
            priority
          />
          <span className="font-display text-foreground text-sm font-semibold">
            Synapse
          </span>
        </Link>
      </header>

      {/* Centred form area */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
