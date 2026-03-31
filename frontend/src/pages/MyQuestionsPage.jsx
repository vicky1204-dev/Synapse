import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../auth/useAuth";
import { toast } from "react-toastify";
import ErrorToast from "../components/toasts/ErrorToast";
import { api } from "../utils/axios";
import { motion } from "framer-motion";
import {containerVariants, itemVariants} from "../animations/variants.js"
import { CircleCheckBig, ThumbsDown, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyQuestionsPage = () => {
  const { user } = useAuth();
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/questions");
      const questionArray = res.data.data.questions;
      setQuestionsList(
        questionArray.filter((q) => q?.author?._id === user?.id),
      );
    } catch (error) {
      toast(
        <ErrorToast
          message={"There was an error fetching the questions."}
          title="Fetching failed"
        />,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className=" w-full min-h-screen p-8 bg-black relative">
      <PageHeader title={"My Questions"} />
      {questionsList.map((question, index)=>{
        return (
        <motion.div
                  variants={itemVariants}
                  key={question._id}
                  onClick={() => navigate(`/study/questions/${question._id}`)}
                  className="flex flex-col border border-white/15 cursor-pointer hover:border-white/30 duration-300 p-4 rounded-lg gap-4"
                >
                  <div className="flex justify-between">
                    <div className="text-xs flex items-center justify-center gap-1">
                      <div className="w-6 h-6 gap-1 rounded-full bg-white/30 p-px">
                        <img
                          src={
                            question.author?.avatar
                              ? question.author?.avatar
                              : "/assets/user-round.svg"
                          }
                          className="rounded-full object-cover"
                          alt=""
                        />
                      </div>
                      <h1>{question.author.username}</h1>
                    </div>
                    {question.isClosed ? (
                      <div className="text-xs px-2 py-1 rounded-full flex bg-lime-400 text-black gap-1">
                        {" "}
                        <CircleCheckBig strokeWidth={1} size={16} /> Answered
                      </div>
                    ) : (
                      <div className="text-xs px-2 py-1 rounded-full bg-text-secondary text-black">
                        Unanswered
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1>{question.title}</h1>
                    {question.body && (
                      <p className="text-text-secondary">{question.body}</p>
                    )}
                  </div>
                  <div className="w-fit flex gap-4">
                    <div className="flex items-center gap-2 text-xs">
                      {question.upvotes} <ThumbsUp strokeWidth={1} size={16} />
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {question.downvotes}{" "}
                      <ThumbsDown strokeWidth={1} size={16} />
                    </div>
                  </div>
                </motion.div>
        )
      })}
    </div>
  );
};

export default MyQuestionsPage;
