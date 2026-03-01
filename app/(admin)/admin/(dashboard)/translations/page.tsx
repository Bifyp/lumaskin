import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TranslationsPage() {
  const translations = await prisma.translation.findMany({
    orderBy: { key: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Translations</h1>
        <Link href="/admin/translations/new">
          <Button>Добавить перевод</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Key</th>
              <th className="py-2">Locale</th>
              <th className="py-2">Value</th>
              <th className="py-2 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {translations.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="py-2">{t.key}</td>
                <td className="py-2">{t.locale}</td>
                <td className="py-2">{t.value}</td>
                <td className="py-2">
                  <Link href={`/admin/translations/${t.id}`}>
                    <Button size="sm" variant="outline">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
