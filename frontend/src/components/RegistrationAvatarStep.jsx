import { useEffect, useState } from "react";
import { UserRound, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const data = [
  {
    label: "Illustration",
    value: "illustration",
    url: "https://api.dicebear.com/9.x/avataaars/svg?seed=",
  },
  {
    label: "Adventurer",
    value: "adventurer",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=",
  },
  {
    label: "Adventurer Neutral",
    value: "adventurer-neutral",
    url: "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=",
  },
  {
    label: "Bots",
    value: "bots",
    url: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=",
  },
  {
    label: "Dylan",
    value: "dylan",
    url: "https://api.dicebear.com/9.x/dylan/svg?seed=",
  },
  {
    label: "Adventurer",
    value: "adventurer",
    url: "https://api.dicebear.com/9.x/adventurer/svg?seed=",
  },
];

const RegistrationAvatarStep = ({ form, setForm }) => {
  const [src, setSrc] = useState("");
  const [option, setOption] = useState("dylan");

  function generateAvatar() {
    const object = data.find((item) => item.value === option);
    const randomValue = Date.now();
    const url = `${object.url}${randomValue}`;
    setSrc(url);
    setForm({ ...form, avatar: url });
  }
  function onOptionChange(e) {
    setOption(e.target.value);
  }

  useEffect(() => {
    generateAvatar();
  }, [option]);
  return (
    <>
      <div className="flex gap-16 justify-center">
        <div className="bg-white w-40 h-40 rounded-full flex items-center justify-center">
          {src ? (
            <img
              src={src}
              className="object-cover w-40 h-40 rounded-full"
            ></img>
          ) : (
            <UserRound size={64} strokeWidth={1} />
          )}
        </div>

        <div className="flex flex-col gap-4 justify-center">
          <select
            className="focus:outline-none border-b border-white/20 py-2 px-3"
            value={option}
            onChange={onOptionChange}
          >
            {data.map((item, index) => (
              <option value={item.value} key={index}>
                {item.label}
              </option>
            ))}
          </select>
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.99,
              y: 0,
            }}
            transition={{
              duration:0.1,
            }}
            onClick={generateAvatar}
            className="flex justify-between cursor-pointer py-2 px-3 rounded-full border border-white/20 hover:border-white/40 duration-200"
          >
            Generate <RotateCcw />
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default RegistrationAvatarStep;
