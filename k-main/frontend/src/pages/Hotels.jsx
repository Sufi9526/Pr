import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItineraryDisplay from "../components/ItineraryDisplay";

const Hotels = () => {
  const navigate = useNavigate();
  const [travelData, setTravelData] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [checkInTime, setCheckInTime] = useState("");
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
    fetchHotels(data.toLocation);
  }, [navigate]);

  const fetchHotels = async (location) => {
    try {
      const response = await axios.get(`/api/hotels/${location}`);
      setHotels(response.data);
    } catch (err) {
      setError("Failed to load hotels");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    setCheckInTime("");
    setItinerary(null);
  };

  const handleGenerateItinerary = async () => {
    if (!selectedHotel || !checkInTime) {
      setError("Please select a hotel and enter check-in time");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const response = await axios.post(
        "/api/itinerary/generate-from-hotel",
        {
          hotelId: selectedHotel._id,
          checkInTime,
          numberOfDays: travelData.numberOfDays,
        }
      );
      setItinerary(response.data);
    } catch (err) {
      setError("Failed to generate itinerary");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Loading hotels...</p>
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
            Hotels in {travelData.toLocation}
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

        {/* Hotels Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            Available Accommodations
          </h3>
          <p className="text-gray-600 text-sm">
            Choose your stay for {travelData.numberOfDays}{" "}
            {parseInt(travelData.numberOfDays) === 1 ? "day" : "days"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                onClick={() => handleHotelSelect(hotel)}
                className={`cursor-pointer rounded-2xl p-5 border transition shadow-sm hover:shadow-lg
                  ${
                    selectedHotel?._id === hotel._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {hotel.name}
                  </h4>
                  <span className="text-yellow-500 text-sm">
                    {"⭐".repeat(Math.floor(hotel.rating))}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  📍 {hotel.address}
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <div>💰 ₹{hotel.pricePerNight}/night</div>

                  {hotel.nearbyTouristPlaces && (
                    <div>
                      🗺️ {hotel.nearbyTouristPlaces.length} nearby places
                    </div>
                  )}
                </div>

                {hotel.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {hotel.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Check-in Section */}
        {selectedHotel && (
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Enter Check-in Details
            </h3>

            <div className="text-sm text-gray-700">
              <p>
                <strong>Selected Hotel:</strong> {selectedHotel.name}
              </p>
              <p>Please enter your check-out time below:</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="checkInTime"
                  className="text-sm font-medium text-gray-700"
                >
                  Check-out Time
                </label>
                <input
                  type="time"
                  id="checkInTime"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                />
              </div>

              <button
                onClick={handleGenerateItinerary}
                disabled={generating}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate Itinerary"}
              </button>
            </div>
          </div>
        )}

        {/* Itinerary */}
        {generating ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">
              Creating your personalized itinerary...
            </p>
          </div>
        ) : (
          itinerary && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Your Hotel-Based Itinerary
              </h3>
              <p className="text-gray-600 text-sm">
                {travelData.numberOfDays}-day itinerary from{" "}
                {itinerary.hotel.name}
              </p>

              <ItineraryDisplay itinerary={itinerary} isHotelBased />
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

export default Hotels;
