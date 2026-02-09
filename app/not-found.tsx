import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600">404</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400">Page not found</p>
      <Link
        href="/"
        className="mt-4 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
