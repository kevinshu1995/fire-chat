export default function Loading() {
  return (
    <div className="min-w-screen fixed top-0 left-0 z-50 h-full min-h-screen w-full bg-gray-200 bg-opacity-75 text-gray-600">
      <div className="flex h-full w-full flex-col items-center justify-center gap-10">
        <div className="relative h-10 w-10 animate-ping">
          <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
            <span className="block h-full w-full animate-spin border-4 border-gray-600" />
          </span>
          <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2">
            <span className="block h-full w-full animate-spin border-8 border-gray-600" />
          </span>
        </div>
        <p>LOADING</p>
      </div>
    </div>
  )
}
