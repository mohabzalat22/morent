import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import api from "../api/axios";
import CarCard from "../components/CarCard";
import StarIcon from "../components/icons/StarIcon";
import StarOutlineIcon from "../components/icons/StarOutlineIcon";

function DetailPage() {
  const { id } = useParams();

  // Loading states
  const [reviewLoad, setReviewLoad] = useState(true);
  const [dataDetailLoad, setDataDetailLoad] = useState(true);

  // Error handling
  const [errorMessage, setErrorMessage] = useState("");
  const [hideErrorMessage, setHideErrorMessage] = useState(true);

  // Filter states
  const [type, setType] = useState({
    sport: false,
    suv: false,
    mpv: false,
    sedan: false,
    coupe: false,
    hatchback: false,
  });

  const [capacity, setCapacity] = useState({
    x2: false,
    x4: false,
    x6: false,
    x8: false,
  });

  const [priceFilter, setPriceFilter] = useState(50);

  // Data states
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState({});
  const [dataFilter, setDataFilter] = useState([]);

  // Review modal states
  const [stars, setStars] = useState([]);
  const [review, setReview] = useState("");
  const [user, setUser] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [modal, setModal] = useState(false);
  const [descriptionClick, setDescriptionClick] = useState(false);

  const addStar = (n) => {
    const newStars = [];
    for (let i = 1; i <= n; i++) {
      newStars.push(i);
    }
    setStars(newStars);
  };

  // Fetch side data
  useEffect(() => {
    const getSideData = async () => {
      try {
        const res = await api.get("/api/v1/category/data");
        setData(res.data);
      } catch (e) {
        setHideErrorMessage(false);
        setErrorMessage(`Status ${e.response?.status} Side Data.`);
      }
    };
    getSideData();
  }, []);

  // Fetch detail data
  useEffect(() => {
    const getDetailData = async () => {
      try {
        const res = await api.get(`/api/v1/detail/${id}`);
        setDataDetail(res.data);
        setDataDetailLoad(false);
      } catch (e) {
        setHideErrorMessage(false);
        setErrorMessage(`Status ${e.response?.status} Detail Data.`);
      }
    };
    getDetailData();
  }, [id]);

  // Fetch user data
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get("/api/user");
        setUser(res.data.name);
        setProfileImage(res.data.image);
      } catch (e) {
        setHideErrorMessage(false);
        setErrorMessage(`Status ${e.response?.status} User.`);
      }
    };
    getUser();
  }, []);

  // Fetch reviews
  useEffect(() => {
    const getReviews = async () => {
      try {
        const userRes = await api.get("/api/user");
        const res = await api.post("/api/user/data/reviews", {
          user: userRes.data,
          car_id: id,
        });
        setReviews(res.data);
        setReviewLoad(false);
      } catch (e) {
        setReviewLoad(false);
      }
    };
    getReviews();
  }, [id]);

  // Filter cars
  useEffect(() => {
    const filter = async () => {
      try {
        const filteredType = Object.entries(type)
          .filter(([, value]) => value)
          .map(([key]) => key);

        const filteredCapacity = Object.entries(capacity)
          .filter(([, value]) => value)
          .map(([key]) => key.replace("x", ""));

        const res = await api.post("/api/v1/detail/filter", {
          type: filteredType,
          capacity: filteredCapacity,
          price: priceFilter,
        });
        setDataFilter(res.data);
      } catch (e) {
        setHideErrorMessage(false);
        setErrorMessage(`Status ${e.response?.status} Cars Filter.`);
      }
    };
    filter();
  }, [type, capacity, priceFilter]);

  const sendReview = async () => {
    try {
      const starsCount = stars.length ? stars[stars.length - 1] : 0;
      const userRes = await api.get("/api/user");
      await api.post("/api/user/data/make/review", {
        car_id: id,
        user: userRes.data,
        review,
        stars: starsCount,
      });
      setHideErrorMessage(false);
      setErrorMessage("Review Sent");
    } catch (e) {
      setHideErrorMessage(false);
      setErrorMessage(`Status ${e.response?.status} Send Reviews.`);
    }
  };

  const handleTypeChange = (key) => {
    setType((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCapacityChange = (key) => {
    setCapacity((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white">
      <div className="xl:container mx-auto relative">
        {/* Toast message */}
        <div className="flex justify-end p-1">
          {!hideErrorMessage && (
            <div
              id="toast-undo"
              className="bg-gray-800 flex items-center w-full max-w-xs p-4 text-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
              role="alert"
            >
              <div className="text-sm font-normal">{errorMessage}</div>
              <div className="flex items-center ms-auto space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => setHideErrorMessage(true)}
                  type="button"
                  className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 max-h-1/2 z-50 ${
            modal ? "" : "hidden"
          }`}
        >
          <div className="bg-gray-100 p-8 rounded-lg border shadow">
            <div className="flex justify-end">
              <button onClick={() => setModal(false)}>
                <svg className="w-8 h-8" fill="gray" viewBox="0 0 512 512">
                  <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" />
                </svg>
              </button>
            </div>
            <div className="flex my-6">
              <div className="flex-shrink-0">
                <img
                  src={profileImage}
                  alt=""
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex-grow px-4">
                <h3 className="text-gray-800 font-bold text-xl">{user}</h3>
                <h4 className="text-gray-400 text-sm">User</h4>
              </div>
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="5"
              className="block w-full p-2 rounded-md focus:outline-1 focus:border-gray-100 border focus:outline-gray-200 text-gray-800"
              placeholder="Review here!"
            />
            <div className="flex justify-between items-end">
              <div>
                <h5 className="mt-4 text-lg text-gray-800 font-bold">RATE</h5>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="m-1 cursor-pointer"
                        onClick={() => addStar(n)}
                      >
                        {stars.includes(n) ? <StarIcon /> : <StarOutlineIcon />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="my-2">
                <button
                  onClick={sendReview}
                  className="bg-blue-500 text-white text-lg rounded-md py-2 px-4"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:grid grid-cols-12">
          {/* Sidebar */}
          <div className="hidden xl:block col-start-1 col-span-3 bg-white py-6 px-10">
            <h3 className="text-sm text-gray-400">TYPE</h3>
            <ul className="p-3">
              {["sport", "suv", "mpv", "sedan", "coupe", "hatchback"].map(
                (typeKey, idx) => (
                  <li key={typeKey}>
                    <div className="flex items-center my-4">
                      <input
                        type="checkbox"
                        checked={type[typeKey]}
                        onChange={() => handleTypeChange(typeKey)}
                        className="w-4 h-4 text-blue-600 rounded ring-offset-2 focus:ring-2 focus:ring-blue-500"
                      />
                      <label className="ms-2 text-gray-600 font-semibold capitalize">
                        {typeKey}
                      </label>
                      {data.length > 0 && (
                        <p className="ms-1 text-sm text-gray-400">
                          ({data[0]?.[idx] || 0})
                        </p>
                      )}
                    </div>
                  </li>
                )
              )}
            </ul>

            <h3 className="text-sm text-gray-400 mt-2">CAPACITY</h3>
            <ul className="p-3">
              {[
                { key: "x2", label: "2 Person", idx: 0 },
                { key: "x4", label: "4 Person", idx: 1 },
                { key: "x6", label: "6 Person", idx: 2 },
                { key: "x8", label: "8 or More", idx: 3 },
              ].map(({ key, label, idx }) => (
                <li key={key}>
                  <div className="flex items-center my-4">
                    <input
                      type="checkbox"
                      checked={capacity[key]}
                      onChange={() => handleCapacityChange(key)}
                      className="w-4 h-4 text-blue-600 rounded ring-offset-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="ms-2 text-gray-600 font-semibold">
                      {label}
                    </label>
                    {data.length > 0 && (
                      <p className="ms-1 text-sm text-gray-400">
                        ({data[1]?.[idx] || 0})
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="text-sm text-gray-400 mt-2">PRICE</h3>
            <div>
              <input
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
                type="range"
                className="w-full my-4"
                min="0"
                max="100"
              />
              <h3 className="text-xl font-semibold text-gray-600">
                Max <span className="ms-2">${priceFilter}</span>
              </h3>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-start-4 col-span-9 bg-gray-100">
            <div className="xl:grid grid-cols-2 px-4 py-4 md:px-auto md:py-8">
              {/* Left - Car Images */}
              <div className="flex justify-center">
                <div className="flex flex-col">
                  <div className="w-full xl:w-[450px] xl:h-[360] bg-blue-500 rounded-lg">
                    <img src={dataDetail.background} alt="" />
                  </div>
                  {dataDetailLoad ? (
                    <div className="flex justify-center items-center rounded bg-gray-200 h-[300px]">
                      <div role="status">
                        <svg
                          className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex mt-6">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-[150px] h-[90px] bg-blue-500 rounded-lg m-1 flex items-center"
                        >
                          <img src={dataDetail.image} alt="" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right - Car Details */}
              {dataDetailLoad ? (
                <div className="flex justify-center items-center">
                  <div role="status">
                    <svg
                      className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-white flex flex-col justify-center rounded-lg p-6 xl:mx-6">
                  <div>
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-2xl">
                          {dataDetail.name}
                        </h3>
                        <div className="flex items-center">
                          <div className="flex py-2">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="m-1">
                                <StarIcon className="w-4 h-4" />
                              </div>
                            ))}
                            <div className="m-1">
                              <StarOutlineIcon className="w-4 h-4" />
                            </div>
                          </div>
                          <h4 className="ms-2 text-gray-600 font-semibold text-sm">
                            440+ Reviewer
                          </h4>
                        </div>
                      </div>
                      <div>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="red">
                          <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" />
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`mt-4 cursor-pointer ${
                        descriptionClick ? "line-clamp-none" : "line-clamp-3"
                      }`}
                      onClick={() => setDescriptionClick(!descriptionClick)}
                    >
                      <p className="leading-7 text-gray-600 text-balance">
                        {dataDetail.description}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap justify-between p-1">
                      <div>
                        <div className="flex">
                          <h3 className="text-lg text-gray-500">Type Car</h3>
                          <h3 className="text-lg text-gray-700 font-semibold ms-4">
                            {dataDetail.model}
                          </h3>
                        </div>
                        <div className="flex mt-2">
                          <h3 className="text-lg text-gray-500">Steering</h3>
                          <h3 className="text-lg text-gray-700 font-semibold ms-4">
                            {dataDetail.type}
                          </h3>
                        </div>
                      </div>
                      <div>
                        <div className="flex">
                          <h3 className="text-lg text-gray-500">Capacity</h3>
                          <h3 className="text-lg text-gray-700 font-semibold ms-4">
                            {dataDetail.capacity} Person
                          </h3>
                        </div>
                        <div className="flex mt-2">
                          <h3 className="text-lg text-gray-500">Gasoline</h3>
                          <h3 className="text-lg text-gray-700 font-semibold ms-4">
                            {dataDetail.tank}L
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="flex justify-between items-center">
                      <div className="flex items-end">
                        {dataDetail.dailyPrice && (
                          <h1 className="text-gray-800 font-bold text-2xl">
                            ${dataDetail.dailyPrice.toFixed(2)}/
                          </h1>
                        )}
                        <span className="text-sm text-gray-500">day</span>
                      </div>
                      <Link
                        className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 text-white"
                        to={`/payment/${dataDetail.id}`}
                      >
                        Rent Now
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="px-4 py-4 md:px-auto md:py-8">
              <div className="bg-white p-4 rounded-xl">
                <div className="flex justify-between">
                  <div className="flex">
                    <h2 className="text-gray-900 font-semibold text-xl">
                      Reviews
                    </h2>
                    <div className="ms-4 bg-blue px-4 py-1 bg-blue-500 text-white rounded">
                      {reviews.length}
                    </div>
                  </div>
                  <button
                    onClick={() => setModal(!modal)}
                    className="bg-blue px-4 py-1 bg-blue-500 text-white rounded-lg"
                  >
                    Add Review
                  </button>
                </div>

                {reviewLoad ? (
                  <div className="flex justify-center">
                    <div className="m-2" role="status">
                      <svg
                        className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    <div className="my-6">
                      {reviews.map((item, index) => (
                        <div key={index} className="flex mt-6">
                          <div className="flex-shrink-0">
                            <img
                              src={profileImage}
                              alt=""
                              className="w-12 h-12 rounded-full"
                            />
                          </div>
                          <div className="flex-grow px-4">
                            <div className="flex justify-between">
                              <h3 className="text-gray-800 font-bold text-xl">
                                {user}
                              </h3>
                              <p className="text-sm text-gray-400">
                                {item.created_at}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <h4 className="text-gray-400 text-sm">User</h4>
                              <div className="flex items-center">
                                <div className="flex">
                                  {Array.from({ length: item.stars }).map(
                                    (_, i) => (
                                      <div key={i} className="m-1">
                                        <StarIcon className="w-4 h-4" />
                                      </div>
                                    )
                                  )}
                                  {Array.from({ length: 5 - item.stars }).map(
                                    (_, i) => (
                                      <div key={i} className="m-1">
                                        <StarOutlineIcon className="w-4 h-4" />
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-600 leading-6">
                              {item.review}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <button className="text-gray-400 flex items-center">
                    <span>Show All</span>
                    <svg
                      className="h-4 w-4 ms-2"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M8.00026 11.1996C7.53359 11.1996 7.06692 11.0196 6.71359 10.6663L2.36692 6.31964C2.17359 6.1263 2.17359 5.80631 2.36692 5.61297C2.56026 5.41964 2.88026 5.41964 3.07359 5.61297L7.42026 9.95964C7.74026 10.2796 8.26026 10.2796 8.58026 9.95964L12.9269 5.61297C13.1203 5.41964 13.4403 5.41964 13.6336 5.61297C13.8269 5.80631 13.8269 6.1263 13.6336 6.31964L9.28692 10.6663C8.93359 11.0196 8.46692 11.1996 8.00026 11.1996Z"
                        fill="#90A3BF"
                        stroke="#90A3BF"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Cars */}
            <div className="px-8 py-4 md:px-6 md:py-8">
              <div className="flex justify-between px-6">
                <h4 className="text-base text-gray-600">Popular Cars</h4>
                <a className="text-blue-700 font-bold text-base cursor-pointer">
                  View All
                </a>
              </div>
              <Swiper
                className="mt-6"
                slidesPerView={1}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                breakpoints={{
                  768: { slidesPerView: 3 },
                }}
              >
                {dataFilter.map((item) => (
                  <SwiperSlide key={item.id}>
                    <CarCard
                      className="m-1"
                      {...item}
                      to={`/detail/${item.id}?name=${item.name}&type=${item.model}&capacity=${item.capacity}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
