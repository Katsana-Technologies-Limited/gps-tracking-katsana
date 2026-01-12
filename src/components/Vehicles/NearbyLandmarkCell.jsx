import useBarikoiReverse, {
  formatBarikoiPlace,
} from "../../hooks/useBarikoiReverse";

export default function NearbyLandmarkCell({ lat, lng, suspended }) {
  const { place, loading } = useBarikoiReverse(lat, lng);

  const fullPlace = formatBarikoiPlace(place);
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

  // If we found a decent place, show it, else fallback to lat/lng
  return (
    <div>
      <div className="text-sm text-gray-700 font-normal truncate">
        {fullPlace ? (
          fullPlace
        ) : (
          <span className="text-xs text-gray-400">Location not found</span>
        )}
      </div>
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
