export function VenueCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.25rem] bg-white card-shadow">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-5 w-3/4 rounded-md" />
        <div className="skeleton h-4 w-1/2 rounded-md" />
        <div className="skeleton h-4 w-2/3 rounded-md" />
        <div className="skeleton h-5 w-full rounded-md" />
      </div>
    </div>
  );
}
