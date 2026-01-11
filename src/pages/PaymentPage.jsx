import { useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import RentalSummary from "../components/payment/RentalSummary";

function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();

  const nextStep = () => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      navigate(`/payment/${id}/step/${newStep}`);
    }
  };

  const backStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      navigate(`/payment/${id}/step/${newStep}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12">
        <div className="col-start-1 col-span-7">
          <div className="my-4">
            <Outlet />
          </div>
          <div className="bg-white p-4 flex justify-end rounded-md">
            <button
              className="bg-blue-600 py-2 px-6 mx-2 text-white text-lg rounded-md"
              onClick={backStep}
            >
              Back
            </button>
            <button
              className="bg-blue-600 py-2 px-6 mx-2 text-white text-lg rounded-md"
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        </div>
        <div className="col-start-8 col-span-5 lg:px-4">
          <RentalSummary className="my-4" />
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
