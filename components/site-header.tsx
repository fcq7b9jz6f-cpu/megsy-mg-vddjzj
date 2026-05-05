import Link from 'next/link';
export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center"><Link href="/" className="font-bold">Megsy App</Link></div>
    </header>
  );
}
