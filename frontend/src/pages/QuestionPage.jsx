import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../utils/axios";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Menu, Sparkle } from "lucide-react";
import { useState } from "react";
import AddComponent from "../components/AddComponent";

const QuestionPage = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questionData, setQuestionData] = useState({});
  const [points, setPoints] = useState([]);

  async function fetchQuestion(questionId) {
    const res = await api.get(`/questions/${questionId}`);
    const data = res.data.data;
    console.log(res.data.data);

    // fetch all answers/comments as well
    const splitPoints = data.aiTips ? data.aiTips.split(/(?=\d+\.\s)/) : [];

    setPoints(splitPoints);
    setQuestionData(data);
  }

  useEffect(() => {
    fetchQuestion(questionId);
  }, [questionId]);
  return (
    <div className="bg-black p-8 pt-0 w-full min-h-screen flex gap-4 flex-col">
      <header className="sticky top-0 md:pt-6 bg-black z-10">
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex justify-between items-center">
            <motion.h1
              onClick={() => navigate(-1)}
              className="leading-0 text-3xl origin-left flex items-center gap-2 font-light cursor-pointer"
              initial={{ opacity: 0, filter: "blur(12px)" }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                opacity: { duration: 0.6, ease: "easeOut" },
                filter: { duration: 0.6, ease: "easeOut" },
                fontSize: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
              }}
            >
              <ChevronLeft />
              Back
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.6 } }}
              className="flex gap-6 items-center justify-center"
            >
              <div
                className="sm:hidden cursor-pointer"
                onClick={() => setSidebarVisible((prev) => !prev)}
              >
                <Menu strokeWidth={1} />
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="w-full h-px bg-white/15 mt-3"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
          }}
        ></motion.div>
      </header>
      <div className="text-xs flex items-center justify-start gap-1">
        <div className="w-6 h-6 gap-1 rounded-full bg-white/30 p-px">
          <img
            src={
              questionData.author?.avatar
                ? questionData.author?.avatar
                : "/assets/user-round.svg"
            }
            className="rounded-full object-cover"
            alt=""
          />
        </div>
        <h1>{questionData.author?.username}</h1>
      </div>
      <h1 className="text-2xl font-medium">{questionData.title}</h1>
      <p>{questionData.body}</p>
      <div className="flex gap-2">
        {questionData.requiredSkills?.map((skill, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-center w-fit px-3 py-2 text-xs bg-bg-secondary text-text-secondary rounded-full"
            >
              {skill}
            </div>
          );
        })}
      </div>
      <div className=" bg-bg-secondary p-4 rounded-sm flex flex-col gap-2">
        <h1 className="flex gap-2">
          Approach Tips{" "}
          <Sparkle
            size={12}
            strokeWidth={2}
            className="text-[#7AAACE]"
            fill="#7AAACE"
          />{" "}
        </h1>
        <div className="flex flex-col gap-1  text-text-secondary text-sm">
          {points?.map((point, index) => (
            <p key={index}>{point.trim()}</p>
          ))}
        </div>
      </div>
      <AddComponent
        meta="Got Answers?"
        buttonText="Add your comment"
        onClick={() => setDialogOpen(true)}
      />

      <AnimatePresence>{/* for loading all the comments */}</AnimatePresence>
    </div>
  );
};

export default QuestionPage;
