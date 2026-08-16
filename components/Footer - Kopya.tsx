// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} TeknoHaber. Tüm hakları saklıdır.</p>
        <p className="mt-2">
          Bu sitede yer alan haberler RSS kaynaklarından otomatik olarak toplanmaktadır.
          İçeriklerin tüm hakları ilgili kaynaklara aittir.
        </p>
      </div>
    </footer>
  );
}