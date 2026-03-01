import { Button } from "@/components/ui/button";

export default function NewTranslationPage() {
  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-3xl font-bold">Добавить перевод</h1>

      <form action="/api/translations" method="POST" className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Key</label>
          <input
            type="text"
            name="key"
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Locale</label>
          <input
            type="text"
            name="locale"
            className="w-full border rounded p-2"
            placeholder="en / pl / uk"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Value</label>
          <textarea
            name="value"
            className="w-full border rounded p-2"
            rows={4}
            required
          />
        </div>

        <Button type="submit">Добавить</Button>
      </form>
    </div>
  );
}
