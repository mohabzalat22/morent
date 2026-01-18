import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import Avatar from "../components/Avatar";
import StarIcon from "../components/icons/StarIcon";
import StarOutlineIcon from "../components/icons/StarOutlineIcon";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [reservations, setReservations] = useState([]);
  const [reservationsCars, setReservationsCars] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewsCars, setReviewsCars] = useState({});
  const navigate = useNavigate();

  const fetchCarById = async (carId) => {
    try {
      const res = await api.get(`/cars/${carId}`);
      if (res.data.success) {
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching car data for id", carId, err);
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/profile");
        if (userRes.data.success) {
          const profile = userRes.data.data;
          setName(profile.name);
          setEmail(profile.email);
          setImage(profile.image);
          setReservations(profile.reservations || []);
          setReviews(profile.reviews || []);

          // Fetch car data for reservations
          const reservationCarIds = (profile.reservations || []).map(
            (r) => r.car_id,
          );
          const uniqueReservationCarIds = [...new Set(reservationCarIds)];
          const reservationCarData = {};
          await Promise.all(
            uniqueReservationCarIds.map(async (carId) => {
              reservationCarData[carId] = await fetchCarById(carId);
            }),
          );
          setReservationsCars(reservationCarData);

          // Fetch car data for reviews
          const reviewCarIds = (profile.reviews || []).map((r) => r.car_id);
          const uniqueReviewCarIds = [...new Set(reviewCarIds)];
          const reviewCarData = {};
          await Promise.all(
            uniqueReviewCarIds.map(async (carId) => {
              reviewCarData[carId] = await fetchCarById(carId);
            }),
          );
          setReviewsCars(reviewCarData);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1 w-full max-w-7xl mx-auto py-8 px-2 gap-8">
        {/* Sidebar */}
        <aside className="w-72 min-w-[220px] max-w-xs bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center sticky top-8 self-start h-fit">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow mb-4 bg-white flex items-center justify-center">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar />
            )}
          </div>
          <h2 className="text-xl font-bold mb-1 text-gray-800 dark:text-white">
            {name}
          </h2>
          <p className="text-gray-500 text-sm mb-6">{email}</p>
          <nav className="flex flex-col gap-2 w-full">
            <button className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold">
              Profile
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 dark:text-gray-200">
              Reservations
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 dark:text-gray-200">
              Reviews
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 text-gray-700 dark:text-gray-200">
              Payments
            </button>
          </nav>
          <div className="mt-8 flex flex-col gap-2 w-full">
            <Link to="/">
              <button className="w-full bg-blue-600 text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                Home
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-4 py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Log out
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-8">
          {/* Reservations Section */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Reservations
            </h3>
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="text-gray-400">No reservations found.</div>
              ) : (
                reservations.map((item, index) => {
                  const car = reservationsCars[item.car_id];
                  return (
                    <div
                      key={item.id || index}
                      className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow"
                    >
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:gap-8">
                          <div>
                            <div className="text-gray-500 text-xs">
                              Pick Location
                            </div>
                            <div className="font-semibold text-gray-800 dark:text-gray-100">
                              {item.pick_location}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {item.start_time}
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <div className="text-gray-500 text-xs">
                              Drop Location
                            </div>
                            <div className="font-semibold text-gray-800 dark:text-gray-100">
                              {item.drop_location}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {item.end_time}
                            </div>
                          </div>
                        </div>
                        {car && (
                          <div className="my-2 py-2 flex items-center gap-2">
                            {car.image && (
                              <img
                                src={car.image}
                                alt={car.name}
                                className="max-w-30 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-bold text-blue-700">
                                {car.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {car.brand}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 md:mt-0 flex-shrink-0">
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                          Reservation #{index + 1}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Reviews Section */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Reviews
            </h3>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-gray-400">No reviews found.</div>
              ) : (
                reviews.map((item, index) => {
                  const car = reviewsCars[item.car_id];
                  return (
                    <div
                      key={item.id || index}
                      className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center border">
                          <Avatar />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-100">
                            {car ? car.name : `Car #${item.car_id}`}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {item.review}
                          </div>
                        </div>
                        {car && car.image && (
                          <img
                            src={car.image}
                            alt={car.name}
                            className="max-w-30 h-8 object-cover rounded ml-2"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-2 md:mt-0">
                        {Array.from({ length: item.stars }).map((_, i) => (
                          <StarIcon key={i} />
                        ))}
                        {Array.from({ length: 5 - item.stars }).map((_, i) => (
                          <StarOutlineIcon key={i} />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Payments Section (Placeholder) */}
          <section>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Payments
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-gray-400 text-center">
              Payment history and details coming soon.
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;
