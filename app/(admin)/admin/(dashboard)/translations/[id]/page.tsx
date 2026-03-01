import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function EditTranslationPage({ params }: { params: { id: string } }) {
  const translation = await prisma.translation.findUnique({
    where: { id: params.id }
  });

  if (!translation) return <div>Not found</div>;

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-3xl font-bold">Редактировать перевод</h1>

      <form action={`/api/translations/${translation.id}`} method="POST" className="space-y-4">
        <input type="hidden" name="_method" value="PUT" />

        <div>
          <label className="block mb-1 font-medium">Key</label>
          <input
            type="text"
            name="key"
            defaultValue={translation.key}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Locale</label>
          <input
            type="text"
            name="locale"
            defaultValue={translation.locale}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Value</label>
          <textarea
            name="value"
            defaultValue={translation.value}
            className="w-full border rounded p-2"
            rows={4}
            required
          />
        </div>

        <Button type="submit">Сохранить</Button>
      </form>
    </div>
  );
}
