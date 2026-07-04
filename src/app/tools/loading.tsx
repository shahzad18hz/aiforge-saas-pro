export default function ToolLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start gap-4">
        <div className="skeleton w-14 h-14 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-7 w-48 rounded-xl" />
          <div className="skeleton h-4 w-72 rounded-xl" />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="skeleton h-96 rounded-2xl" />
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    </div>
  );
}
