import { DashboardLayout } from "./components/layout/DashboardLayout";
import { PublicLayout } from "./components/layout/PublicLayout";
// import GoaItinerary from "./Itinerary/GoaItinerary";
import AboutPage from "./pages/About";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import DestinationOptions from "./pages/DestinationOptions";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import ManageData from "./pages/ManageData";
import TouristPlaces from "./pages/TouristPlaces";
import TravelOptions from "./pages/TravelOptions";
import TravelSearch from "./pages/TravelSearch";
import ResetPassword from "./pages/ResetPassword"
import SavedItineraries from "./pages/SavedItineraries";
import Profile from "./pages/Profile";

import { Route, Routes } from "react-router-dom"; // ✅ Router removed

function App() {
  return (

    <Routes>

      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* PURE PUBLIC (no sidebar) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/auth" element={<Auth />} /> */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* DASHBOARD LAYOUT (with sidebar) */}


      <Route path="/dashboard/tripplan" element={<DashboardLayout />}>


        {/* default page: /dashboard/tripplan */}
        <Route index element={<TravelSearch />} />

        {/* nested pages */}
        <Route path="destination-options" element={<DestinationOptions />} />
        <Route path="tourist-places" element={<TouristPlaces />} />
        <Route path="hotels" element={<Hotels />} />
        <Route path="traveloptions" element={<TravelOptions />} />
        <Route path="saved-itineraries" element={<SavedItineraries />} />
        <Route path="profile" element={<Profile />} />

      </Route>



    </Routes>
  );
}

export default App;
