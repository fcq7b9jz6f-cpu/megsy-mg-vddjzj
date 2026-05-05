import { Link } from "react-router-dom";
export default function NotFound() {
  return <main className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-6xl font-bold">404</h1>
    <p className="text-muted-foreground">الصفحة غير موجودة</p>
    <Link to="/" className="text-primary underline">العودة للرئيسية</Link>
  </main>;
}
