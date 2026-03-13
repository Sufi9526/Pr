import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItineraryDisplay from "../components/ItineraryDisplay";

const TouristPlaces = () => {
  const navigate = useNavigate();
  const [travelData, setTravelData] = useState(null);
  const [touristPlaces, setTouristPlaces] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("travelData");
    if (!savedData) {
      navigate("/");
      return;
    }

    const data = JSON.parse(savedData);
    setTravelData(data);
    generateItinerary(data);
  }, [navigate]);

  const generateItinerary = async (data) => {
    if (!data) return;

    setGenerating(true);
    setError("");
    setLoading(true);

    try {
      const arrivalTime = data.selectedOption?.arrivalTime || "09:00";

      const response = await axios.post("/api/itinerary/generate", {
        location: data.toLocation,
        startTime: arrivalTime,
        numberOfDays: data.numberOfDays,
      });

      setItinerary(response.data);

      if (response.data.includedPlaces?.length > 0) {
        setTouristPlaces(response.data.includedPlaces);
      } else {
        fetchTouristPlaces(data.toLocation);
      }
    } catch (err) {
      setError("Failed to generate itinerary");
      console.error(err);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const fetchTouristPlaces = async (location) => {
    try {
      const response = await axios.get(`/api/tourist-places/${location}`);
      setTouristPlaces(response.data);
    } catch (err) {
      setError("Failed to load tourist places");
      console.error(err);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Loading tourist places...</p>
      </div>
    );
  }

  if (!travelData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-800">
            Tourist Places in {travelData.toLocation}
          </h2>

          <button
            onClick={() => navigate("/dashboard/tripplan/destination-options")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Options
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Places Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            Places You'll Visit (
            {itinerary?.includedPlacesCount || touristPlaces.length} places)
          </h3>

          <p className="text-gray-600 text-sm">
            These are the places that fit in your {travelData.numberOfDays}-day
            itinerary
            {itinerary &&
              itinerary.totalPlaces > itinerary.includedPlacesCount &&
              ` (${itinerary.totalPlaces - itinerary.includedPlacesCount} places couldn't fit)`}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {touristPlaces.map((place) => (
              <div
                key={place._id}
                className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {place.category}
                  </span>
                  <span className="text-yellow-500 text-sm">
                    {"⭐".repeat(Math.floor(place.popularity / 2))}
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {place.name}
                </h4>

                <p className="text-gray-600 text-sm line-clamp-4">
                  {place.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Generating */}
        {generating ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">
              Generating your personalized itinerary...
            </p>
          </div>
        ) : (
          itinerary && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Your Customized Itinerary
              </h3>
              <p className="text-gray-600 text-sm">
                Your {travelData.numberOfDays}-day itinerary starting from{" "}
                {itinerary.startTime}
              </p>

              <ItineraryDisplay itinerary={itinerary} />
            </div>
          )
        )}

        {/* Footer Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard/tripplan/destination-options")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-900 transition"
          >
            ← Choose Different Option
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouristPlaces;
