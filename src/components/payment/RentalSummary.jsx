import { StarIcon, StarOutlineIcon } from "../icons";

function RentalSummary() {
  return (
    <div className="p-4 bg-white rounded-md">
      <h3 className="text-gray-800 font-semibold text-xl">Rental Summary</h3>
      <h4 className="text-gray-500 text-sm">
        Prices may change depending on the length of the rental and the price of
        your rental car.
      </h4>
      <div className="mt-6">
        <div className="flex items-center">
          <img src="/src/assets/images/Look.png" alt="Car" className="block" />
          <div className="ms-6">
            <h2 className="text-gray-800 font-bold text-3xl">Nissan GT - R</h2>
            <div className="flex items-center">
              <div className="flex py-2">
                <div className="m-1">
                  <StarIcon className="w-5 h-5" />
                </div>
                <div className="m-1">
                  <StarIcon className="w-5 h-5" />
                </div>
                <div className="m-1">
                  <StarIcon className="w-5 h-5" />
                </div>
                <div className="m-1">
                  <StarIcon className="w-5 h-5" />
                </div>
                <div className="m-1">
                  <StarOutlineIcon className="w-5 h-5" />
                </div>
              </div>
              <h4 className="ms-2 text-gray-500 font-semibold text-base">
                440+ Reviewer
              </h4>
            </div>
          </div>
        </div>
        <hr className="border-0.5 bg-gray-100 my-6" />
        <div className="flex justify-between my-4">
          <h4 className="text-gray-400 text-lg">Subtotal</h4>
          <h3 className="text-gray-800 text-lg font-bold">$80.00</h3>
        </div>
        <div className="flex justify-between my-4">
          <h4 className="text-gray-400 text-lg">Tax</h4>
          <h3 className="text-gray-800 text-lg font-bold">$0</h3>
        </div>
        <div className="bg-gray-100 p-4 rounded-md">
          <input
            type="text"
            className="h-8 bg-transparent focus:outline-none w-2/3"
            placeholder="Apply promo code"
          />
          <button className="w-1/3 font-semibold text-xl">Apply now</button>
        </div>
        <div className="flex justify-between items-center my-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Total Rental Price
            </h2>
            <h4 className="text-sm text-gray-500">
              Overall price and includes rental discount
            </h4>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-2xl">$80.00</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RentalSummary;
