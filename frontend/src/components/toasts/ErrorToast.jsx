import { Info, X } from "lucide-react";

const ErrorToast = ({ message, closeToast, title = "" }) => {
  return (
    <div className="inset-0 flex items-center gap-2 border border-white/15 rounded-lg backdrop-blur-2xl">
      <div className="bg-bg-secondary p-4 rounded-l-lg h-full">
        <Info color="red" strokeWidth={2} size={24} />
      </div>
      <div className="flex flex-col py-2 px-3 gap-1">
        <h1 className="text-white flex items-center justify-between">
          {title ? title : "Error"}
          <span onClick={closeToast} className="cursor-pointer">
            <X  size={18}/>
          </span>
        </h1>
        <p className="text-xs text-text-secondary pr-2">{message}</p>
      </div>
    </div>
  );
};

export default ErrorToast;
