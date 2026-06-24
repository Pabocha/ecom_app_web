// MODIFICATION ICI — Skeleton pour la page détail produit
export default function ProductSkeleton() {
  return (
    <div className="max-w-[1300px] mx-auto px-4 py-5 grid grid-cols-[580px_1fr] gap-6 animate-pulse">
      <div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-3">
          <div className="bg-gray-200" style={{ paddingTop: '66%' }} />
        </div>
        <div className="grid grid-cols-5 gap-2.5 mb-5">
          {Array.from({ length: 5 }, (_, i) => <div key={i} className="bg-gray-200 rounded-lg h-20" />)}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
          <div className="flex gap-4 border-b border-gray-100 pb-3">
            {Array.from({ length: 5 }, (_, i) => <div key={i} className="bg-gray-200 rounded h-4 w-16" />)}
          </div>
          <div className="bg-gray-200 rounded h-4 w-3/4" />
          <div className="bg-gray-200 rounded h-4 w-1/2" />
          <div className="bg-gray-200 rounded h-4 w-2/3" />
          <div className="bg-gray-200 rounded h-4 w-5/6" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
          <div className="bg-gray-200 rounded h-6 w-3/4" />
          <div className="bg-gray-200 rounded h-4 w-1/2" />
          <div className="bg-gray-200 rounded h-4 w-2/3" />
          <div className="bg-gray-200 rounded h-8 w-1/3" />
          <div className="bg-gray-200 rounded h-10 w-full" />
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-200 rounded h-16" />
            <div className="bg-gray-200 rounded h-16" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 rounded-full w-12 h-12" />
            <div className="space-y-2 flex-1">
              <div className="bg-gray-200 rounded h-4 w-1/3" />
              <div className="bg-gray-200 rounded h-3 w-1/4" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }, (_, i) => <div key={i} className="bg-gray-200 rounded h-12" />)}
          </div>
          <div className="flex gap-2">
            <div className="bg-gray-200 rounded h-9 flex-1" />
            <div className="bg-gray-200 rounded h-9 flex-1" />
            <div className="bg-gray-200 rounded h-9 flex-1" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 space-y-3">
          <div className="bg-gray-200 rounded h-4 w-16" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => <div key={i} className="bg-gray-200 rounded h-8 w-20" />)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 space-y-2">
          <div className="bg-gray-200 rounded h-5 w-1/3 mb-3" />
          {Array.from({ length: 4 }, (_, i) => <div key={i} className="bg-gray-200 rounded h-4 w-full" />)}
        </div>
      </div>
    </div>
  );
}
