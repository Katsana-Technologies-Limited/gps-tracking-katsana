import useBarikoiReverse from "../../hooks/useBarikoiReverse";

export default function NearbyLandmarkCell({ lat, lng, suspended }) {
  console.log(lat, lng);
  const { place, loading } = useBarikoiReverse(lat, lng);

  if (suspended) {
    return (
      <span className="inline-block px-2 py-1 bg-[#FFF5F5] text-[#E0677B] text-xs rounded border border-[#FFD6D6]">
        Renew Subscription
      </span>
    );
  }
  if (!lat || !lng || lat === "-" || lng === "-") {
    return (
      <span className="text-xs text-gray-400">Location not available</span>
    );
  }
  if (loading) {
    return <span className="text-xs text-gray-400">Loading address...</span>;
  }

  return (
    <div>
      {place && (place.name || place.Address) ? (
        <>
          {place.name && (
            <div className="text-sm text-gray-700 font-semibold truncate">
              {place.name}
            </div>
          )}
          {place.Address && (
            <div className="text-xs text-gray-500 truncate">
              {place.Address}
            </div>
          )}
        </>
      ) : (
        <div className="text-xs text-gray-400">Location not found</div>
      )}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-xs text-gray-500 hover:text-orange-500"
        title={`${lat}, ${lng}`}
      >
        {lat}, {lng}
      </a>
    </div>
  );
}
