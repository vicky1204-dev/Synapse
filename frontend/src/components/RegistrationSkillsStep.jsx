import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Pill from "./Pill";
import { motion, AnimatePresence } from "framer-motion";

const RegistrationSkillsStep = ({ form, setForm }) => {
  const API_KEY = import.meta.env.VITE_SKILLS_API_KEY;
  const [query, setQuery] = useState("");
  const [suggesstions, setSuggesstions] = useState([]);
  const [selectedSkillsSet, setSelectedSkillsSet] = useState(new Set());
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.trim() === "") {
      setSuggesstions([]);
      return;
    }
    axios
      .get("https://api.apilayer.com/skills", {
        params: {
          q: query,
          count: 10,
        },
        headers: {
          apikey: API_KEY,
        },
      })
      .then((response) => {
        const uniqueSkills = [...new Set(response.data)];

        setSuggesstions(
          uniqueSkills.filter((item) => !selectedSkillsSet.has(item)),
        );
      })
      .catch((error) => {
        console.error("Error fetching skills:", error);
        setSuggesstions([]);
      });
  }, [query, selectedSkillsSet]);

  const handleSelectSkill = (item) => {
    setQuery("");
    setSuggesstions([]);
    setSelectedSkillsSet(new Set([...selectedSkillsSet, item]));
    setForm((prev) => {
      return { ...prev, skills: [...prev.skills, item] };
    });
    inputRef.current.focus();
  };

  const handleRemoveSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((item) => item !== skill) });

    const updatedSet = new Set(selectedSkillsSet);
    updatedSet.delete(skill);
    setSelectedSkillsSet(updatedSet);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      form.skills.length > 0
    ) {
      const lastSkill = form.skills[form.skills.length - 1];
      handleRemoveSkill(lastSkill);
    }
  };
  return (
    <div className="relative flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <h1>Select your skills</h1>
        <div className="loader">loader</div>
      </div>
      <div className="w-full flex flex-wrap border-b border-white/15 items-center gap-2 py-2">
        <AnimatePresence>
          {form.skills?.map((skill, index) => (
            <motion.div
              key={skill}
              className="flex gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Pill text={skill} onClick={() => handleRemoveSkill(skill)} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div>
          <input
            ref={inputRef}
            className="text-text-secondary focus:outline-none py-1 px-2"
            type="text"
            placeholder="Enter a skill"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <ul className="absolute bg-bg-secondary mt-1 rounded-lg max-h-50 overflow-y-scroll">
            {suggesstions.map((item, index) => (
              <li
                key={item}
                onClick={() => handleSelectSkill(item)}
                className={`text-sm text-text-secondary border-b border-white/15 py-2 px-4 hover:text-black hover:bg-white cursor-pointer ${index == 9 ? "rounded-lg" : ""}`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h1>Select your department</h1>
        <select
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          className="focus:outline-none border-b border-white/15 py-3 text-text-secondary"
        >
          <option value="">None</option>
          <option value="cse">CSE</option>
          <option value="mba">MBA</option>
          <option value="bba">BBA</option>
          <option value="bcom">BCOM</option>
        </select>
      </div>
    </div>
  );
};

export default RegistrationSkillsStep;
