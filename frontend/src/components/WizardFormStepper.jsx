import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../auth/useAuth";
import { signup } from "../auth/auth.service.js";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"
import SuccessToast from "./toasts/SuccessToast.jsx";
import ErrorToast from "./toasts/ErrorToast.jsx";

const WizardFormStepper = ({ stepsConfig = [], form, setForm }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const stepRef = useRef([]);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [margins, setMargins] = useState({
    marginRight: 0,
    marginLeft: 0,
  });
  const { setUser } = useAuth();
  const navigate = useNavigate()
  const StepComponent = stepsConfig[currentStep]?.content;
  const isStepValid =
    !stepsConfig[currentStep].validate ||
    stepsConfig[currentStep].validate(form);


  useEffect(() => {
    setMargins({
      marginLeft: stepRef.current[0].offsetWidth / 2,
      marginRight: stepRef.current[stepsConfig.length - 1].offsetWidth / 2,
    });
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newHeight = entry.contentRect.height;

        if (newHeight > 0) {
          setContentHeight(newHeight);
        }
      }
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [currentStep]);

  async function handleNext() {
    const validation = stepsConfig[currentStep].validate;
    if (validation && !validation(form)) return;

    if (currentStep < stepsConfig.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    try {
      setLoading(true);
      const res = await signup(form);
      setUser(res.data.data.user)
      toast(<SuccessToast message={"Registration Successful"} title="Welcome"/>);
      navigate("/study/questions")
    } catch (error) {
      toast(<ErrorToast message={error?.response?.data?.message || "Something went wrong"}/>)
    } finally {
      setLoading(false);
    }
  }

  function handlePrev() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }
  return (
    <>
      <div className="flex justify-between w-full relative">
        {stepsConfig.map((step, index) => {
          return (
            <div
              key={step.name}
              className={`step flex flex-col gap-2 items-center justify-center z-2`}
              ref={(el) => (stepRef.current[index] = el)}
            >
              <div
                className={`step-icon p-3 rounded-full  border ${currentStep === index ? "border-white border-2" : "border-white/15 "} ${currentStep > index ? "bg-bg-completed" : "bg-black"} transition-colors duration-500`}
              >
                {currentStep > index ? (
                  <Check size={16} strokeWidth={2} className="text-black" />
                ) : currentStep === index ? (
                  step.iconActive
                ) : (
                  step.icon
                )}
              </div>
              <div className="flex items-center flex-col justify-center">
                <div
                  className={`step-name text-sm text-text-secondary ${currentStep === index ? "text-white" : ""}`}
                >
                  {step.name}
                </div>
                <div
                  className={`step-name text-xs  leading-4 ${currentStep === index ? "text-text-secondary" : "text-text-secondary/50"}`}
                >
                  {step.metaData}
                </div>
              </div>
            </div>
          );
        })}
        {/* PROGRESS BAR *************/}

        <div
          className="progress h-px bg-text-secondary/50 absolute top-6 z-1"
          style={{
            width: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
            marginLeft: `${margins.marginLeft}px`,
            marginRight: `${margins.marginRight}px`,
          }}
        >
          <div
            className="progress-bar bg-white h-px ease-in-out duration-200"
            style={{
              width: `${(currentStep / (stepsConfig.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      {/* CONTENTTTT******** */}
      <motion.div
        animate={{ height: contentHeight }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        <motion.div ref={contentRef}>
          <StepComponent form={form} setForm={setForm} />
        </motion.div>
      </motion.div>

      {/* BUTTONSSS*********** */}
      <div className="flex justify-end gap-4">
        {currentStep > 0 ? (
          <motion.button
            disabled={!isStepValid || loading}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.99,
            }}
            transition={{
              duration: 0.1,
            }}
            className={`px-6 py-2 border border-white/20 rounded-lg flex items-center justify-between text-sm ${!loading ? "cursor-pointer text-text-secondary  hover:border-white/40 " : "cursor-not-allowed text-white/40"}`}
            onClick={handlePrev}
          >
            <ChevronLeft
              strokeWidth={1}
              color={`${loading ? "grey" : "white"}`}
            />
            Previous
          </motion.button>
        ) : (
          ""
        )}
        <motion.button
          disabled={!isStepValid || loading}
          whileHover={isStepValid ? { scale: 1.02 } : undefined}
          whileTap={isStepValid ? { scale: 0.97 } : undefined}
          transition={{ duration: 0.05 }}
          className={`px-6 py-2 bg-white rounded-lg text-black flex items-center justify-between text-sm duration-200 ${isStepValid && !loading ? "cursor-pointer" : "cursor-not-allowed bg-white/40"}`}
          onClick={handleNext}
        >
          {currentStep === stepsConfig.length - 1 ? (
            "Finish"
          ) : (
            <>
              Next <ChevronRight strokeWidth={1} color="black" />
            </>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default WizardFormStepper;
