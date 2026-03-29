import { CircleCheckBig, X } from "lucide-react";

const SuccessToast = ({ message, closeToast, title="" }) => {
  return (
    <div className="inset-0 flex items-center gap-2 border border-white/15 rounded-lg backdrop-blur-2xl">
      <div className="bg-bg-secondary p-4 rounded-l-lg h-full">
        <CircleCheckBig color="lightgreen" strokeWidth={2} size={24} />
      </div>
      <div className="flex flex-col py-2 px-3 gap-1">
        <h1 className="text-white flex items-center justify-between gap-4">
               {title ? title : "Success"}
          <span onClick={closeToast} className="cursor-pointer">
            <X  size={18}/>
          </span>
        </h1>
        <p className="text-xs text-text-secondary pr-2">{message}</p>
      </div>
    </div>
  );
};

export default SuccessToast;
