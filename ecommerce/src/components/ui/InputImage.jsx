import { Package } from 'lucide-react';

export function InputImage({ label, name, register, watch, error }) {
  const fileList = watch(name);
  const fileName = fileList?.length > 0 ? fileList[0].name : 'Aucun fichier choisi';

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-xs text-slate-500">{fileName}</span>
      </div>
      <div className="group relative rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-orange-500 hover:bg-white">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
          <Package size={22} className={`inline-block shrink-0 align-[-0.125em] `}/>
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-900">Téléchargez un document</p>
        <p className="mt-2 text-sm text-slate-600">JPG, PNG ou GIF jusqu'à 5 Mo.</p>
        <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
          Sélectionner une image
          <input
            {...register(name)}
            type="file"
            accept="image/*"
            className="sr-only"
          />
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}