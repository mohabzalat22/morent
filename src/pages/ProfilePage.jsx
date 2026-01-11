import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/api/user");
        if (userRes.status === 200) {
          setName(userRes.data.name);
          setEmail(userRes.data.email);
          setImage(userRes.data.image);
        }

        const reservationsRes = await api.post("/api/user/data/reservations", {
          user: userRes.data,
        });
        setReservations(reservationsRes.data);

        const reviewsRes = await api.post("/api/user/data/reviews", {
          user: userRes.data,
        });
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mt-12 bg-gray-200 rounded-md p-4">
        <div className="flex justify-end gap-2">
          <Link to="/">
            <button className="bg-blue-500 p-2 text-white text-lg rounded">
              Home
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-blue-500 p-2 text-white text-lg rounded"
          >
            Log out
          </button>
        </div>
        <div className="w-[200px] h-[200px] object-cover overflow-hidden rounded-xl">
          <img src={image} alt="" className="" />
        </div>
        <div className="mt-8">
          <h1 className="text-xl text-gray-500 font-bold my-6">Informations</h1>
          <p className="bg-gray-100 p-2 text-lg m-2 rounded-md">{name}</p>
          <p className="bg-gray-100 p-2 text-lg m-2 rounded-md">{email}</p>
        </div>
        <h1 className="text-xl text-gray-500 font-bold my-6">Reservations</h1>
        <table className="table-auto w-full border-collapse border border-slate-500">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-slate-500 text-white text-lg py-1 w-16">
                ID
              </th>
              <th className="border border-slate-500 text-white text-lg py-1">
                Pick
              </th>
              <th className="border border-slate-500 text-white text-lg py-1">
                Drop
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {reservations.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-slate-500 text-center">
                  {index + 1}
                </td>
                <td className="border border-slate-500">
                  <div className="flex justify-between p-4">
                    <div>Location</div>
                    <div>
                      <span className="ms-10">{item.pick}</span>
                    </div>
                  </div>
                  <div className="flex justify-between border border-white border-t-slate-700 p-4">
                    <div>Date</div>
                    <div>
                      <span className="ms-10">{item.start_time}</span>
                    </div>
                  </div>
                </td>
                <td className="border border-slate-500">
                  <div className="flex justify-between p-4">
                    <div>Location</div>
                    <div>
                      <span className="ms-10">{item.drop}</span>
                    </div>
                  </div>
                  <div className="flex justify-between border border-white border-t-slate-700 p-4">
                    <div>Date</div>
                    <div>
                      <span className="ms-10">{item.end_time}</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h1 className="text-xl text-gray-500 font-bold my-6">Reviews</h1>
        <table className="table-auto w-full border-collapse border border-slate-500">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-slate-500 text-white text-lg py-2 w-16">
                ID
              </th>
              <th className="border border-slate-500 text-white text-lg py-2">
                car_id
              </th>
              <th className="border border-slate-500 text-white text-lg py-2">
                review
              </th>
              <th className="border border-slate-500 text-white text-lg py-2">
                stars
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {reviews.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-slate-500 p-1 text-center">
                  {index + 1}
                </td>
                <td className="border border-slate-500 p-1 text-center">
                  {item.car_id}
                </td>
                <td className="border border-slate-500 p-1">{item.review}</td>
                <td className="border border-slate-500 p-1">{item.stars}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h1 className="text-xl text-gray-500 font-bold my-6">Payments</h1>
      </div>
    </div>
  );
}

export default ProfilePage;
