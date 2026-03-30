import { X } from "lucide-react";
import { useMainContext } from "../context/MainContext";

const NotificationPanel = () => {
  const { setNotificationVisible } = useMainContext();
  return (
    <div className={`flex flex-col h-full backdrop-blur-lg p-6 border-l border-white/15`}>
      <div className="flex flex-col gap-0">
        <div className="flex gap-4 items-center justify-between">
        <h1 className="text-xl">Notifications</h1>
        <X
          onClick={() => setNotificationVisible(false)}
          className="cursor-pointer"
          size={32}
          strokeWidth={1}
        />
      </div>
      <div className="w-full h-px bg-white/15"></div>
      </div>
    </div>
  );
};

export default NotificationPanel;
