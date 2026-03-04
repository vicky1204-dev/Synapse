import { Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AddComponent from "../components/AddComponent";
import { useEffect, useState } from "react";
import { api } from "../utils/axios";
import { toast } from "react-toastify";
import ErrorToast from "../components/toasts/ErrorToast";
import SuccessToast from "../components/toasts/SuccessToast";
import Dialog from "../components/Dialog";
import { motion } from "framer-motion";
import { CircleCheckBig, X } from "lucide-react";

const QuestionsPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [questionForm, setQuestionForm] = useState({
    title: "",
    body: "",
    tags: [],
  });

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/questions");
      setQuestionsList(res.data.data.questions);
    } catch (error) {
      toast(
        <ErrorToast
          message={"There was an error fetching the questions."}
          title="Fetching failed"
        />,
      );
    }
  };

  async function submitForm() {
    try {
      await api.post("/questions", questionForm);
      toast(<SuccessToast message={"Question added successfully!"} />);
      fetchQuestions();
      setDialogOpen(false);
    } catch (error) {
      toast(<ErrorToast message={"Error adding question!"} />);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className=" w-full min-h-screen p-8 bg-black relative flex gap-4 flex-col">
      <PageHeader title={"Questions"} />
      <AddComponent
        meta="Got doubts?"
        buttonText="Ask a Question"
        icon={Plus}
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
              placeholder="Enter the question"
              className="text-text-secondary focus:outline-none focus:border-white/30 border-b border-white/15 py-1 px-2 w-full"
            />
          </div>
          <button
            onClick={submitForm}
            className="bg-black p-2 rounded-lg hover:bg-white hover:text-black cursor-pointer duration-300"
          >
            Submit
          </button>
        </div>
      </Dialog>
      {questionsList.map((question, index) => {
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 * index }}
            key={question._id}
            className="flex flex-col border border-white/20 cursor-pointer hover:bg-bg-secondary p-4 rounded-lg gap-2"
          >
            <div className="flex justify-between">
              <div className="text-sm flex items-center justify-center gap-1">
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
                <div className="text-xs px-2 py-1 rounded-full flex bg-lime-400 text-black gap-1"> <CircleCheckBig strokeWidth={1} size={16}/> Answered</div>
              ) : (
                <div className="text-xs px-2 py-1 rounded-full bg-text-secondary text-black">Unanswered</div>
              )}
            </div>
            <h1>{question.title}</h1>
            <p className="text-text-secondary">{question.body}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuestionsPage;
