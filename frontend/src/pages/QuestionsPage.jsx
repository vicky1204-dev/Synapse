import PageHeader from "../components/PageHeader";
import AddComponent from "../components/AddComponent";
import { useEffect, useState } from "react";
import { api } from "../utils/axios";
import { toast } from "react-toastify";
import ErrorToast from "../components/toasts/ErrorToast";
import SuccessToast from "../components/toasts/SuccessToast";
import Dialog from "../components/Dialog";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheckBig, X, ThumbsDown, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import {containerVariants, itemVariants} from "../animations/variants.js"

const QuestionsPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    title: "",
    body: "",
    tags: [],
  });
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/questions");
      setQuestionsList(res.data.data.questions);
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

  async function submitForm() {
    try {
      await api.post("/questions", questionForm);
      toast(<SuccessToast message={"Question added successfully!"} />);
      fetchQuestions();
      setDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast(
        <ErrorToast
          message={error.response?.data?.message || "Error adding question!"}
        />,
      );
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className=" w-full min-h-screen p-8 bg-black flex gap-4 flex-col">
      <PageHeader title={"Questions"} />
      <AddComponent
        meta="Got doubts?"
        buttonText="Ask a Question"
        onClick={() => setDialogOpen(true)}
      />
      <Dialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <div className="flex flex-col gap-8 justify-center">
          <div className="flex flex-col gap-1 w-90">
            <h1>Title</h1>
            <input
              value={questionForm.title}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, title: e.target.value })
              }
              type="text"
              placeholder="Enter the question"
              className="text-text-secondary focus:outline-none focus:border-white/30 border-b border-white/15 py-1 px-2 w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1>Description</h1>
            <input
              value={questionForm.body}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, body: e.target.value })
              }
              type="text"
              placeholder="Enter the description"
              className="text-text-secondary focus:outline-none focus:border-white/30 border-b border-white/15 py-1 px-2 w-full"
            />
          </div>
          <button
            onClick={submitForm}
            className=" bg-bg-secondary rounded-full py-2 px-4 cursor-pointer flex justify-center items-center gap-2 text-sm text-text-secondary hover:text-white border border-black hover:border-white/15 duration-200 ease-in-out"
          >
            Submit
          </button>
        </div>
      </Dialog>

      <motion.h1 className="text-3xl mt-10 mb-4">Questions For You</motion.h1>

      {/* QUESTRIONSSSSSS ******** */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-4"
          >
            <SkeletonLoader />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-4"
          >
            {questionsList.map((question, index) => {
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
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionsPage;
