import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WizardFormStepper from "../components/WizardFormStepper.jsx";
import { Form, UserRound, NotebookPen, FileCheck } from "lucide-react";
import RegistrationDetailsStep from "../components/RegistrationDetailsStep.jsx";
import RegistrationAvatarStep from "../components/RegistrationAvatarStep.jsx";
import RegistrationSkillsStep from "../components/RegistrationSkillsStep.jsx";
import RegistrationSubmitStep from "../components/RegistrationSubmitStep.jsx";
import synapse_logo from "../assets/synapse_logo.svg"

const stepsConfig = [
  {
    icon: <Form strokeWidth={1} size={16} className="text-text-secondary" />,
    iconActive: <Form strokeWidth={2} size={16} />,
    name: "Details",
    metaData: "Personal details",
    content: RegistrationDetailsStep,
    validate: (form) => {
      return (
        form.username.trim() !== "" &&
        form.email.trim() !== "" &&
        form.password.trim() !== ""
      );
    },
  },
  {
    icon: (
      <NotebookPen strokeWidth={1} size={16} className="text-text-secondary" />
    ),
    iconActive: <NotebookPen strokeWidth={2} size={16} />,
    name: "Skills",
    metaData: "Your skills",
    content: RegistrationSkillsStep,
  },
  {
    icon: (
      <UserRound strokeWidth={1} size={16} className="text-text-secondary" />
    ),
    iconActive: <UserRound strokeWidth={2} size={16} />,
    name: "Avatar",
    metaData: "Choose avatar",
    content: RegistrationAvatarStep,
  },
  {
    icon: (
      <FileCheck strokeWidth={1} size={16} className="text-text-secondary" />
    ),
    iconActive: <FileCheck strokeWidth={2} size={16} />,
    name: "Verify",
    metaData: "Verify form",
    content: RegistrationSubmitStep,
  },
];

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
    skills: [],
    department: "",
  });

  return (
      <div
        className="text-text-primary flex flex-col gap-8 border border-white/20 rounded-lg py-6 px-8 w-lg"
      >
        <div>
           <div className="w-fit m-auto py-1 px-3 rounded-full border border-white/30 mb-3"><img className="w-18" src={synapse_logo} alt="" /></div>
          <h1 className="text-[40px] text-text-primary font-medium text-center">Sign Up</h1>
          <h1 className="text-sm text-text-secondary text-center">
            Complete the steps below to register
          </h1>
        </div>
        <WizardFormStepper
          stepsConfig={stepsConfig}
          form={form}
          setForm={setForm}
        />
      </div>
  );
};

export default SignupPage;
