import PageHeader from "../components/PageHeader";
import AddComponent from "../components/AddComponent";
import { Plus } from "lucide-react";
import Dialog from "../components/Dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../utils/axios";
import { toast } from "react-toastify";
import ErrorToast from "../components/toasts/ErrorToast";
import SuccessToast from "../components/toasts/SuccessToast";

const DiscussionsPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [discussionRoomForm, setDiscussionRoomForm] = useState({
    name: "",
    subject: "",
    tags: [],
  });
  const navigate = useNavigate();

  async function submitForm() {
    try {
      const res = await api.post("/chat/rooms", discussionRoomForm);
      console.log(res.data.data._id);
      await api.post(`/chat/rooms/${res.data.data._id}/join`)
      toast(<SuccessToast message={"Room created successfully!"} />);
      setDialogOpen(false);
      navigate(`/study/discussions/${res.data.data._id}`);
    } catch (error) {
      console.log(error);
      toast(
        <ErrorToast
          message={error.response?.data?.message || "Error creating room"}
        />,
      );
    }
  }

  async function fetchRooms() {
    try {
      setLoading(true);
      const res = await api.get("/chat/rooms");
      setRoomList(res.data.data);
    } catch (error) {
      toast(
        <ErrorToast
          message={"There was an error fetching the Rooms."}
          title="Fetching failed"
        />,
      );
    } finally {
      setLoading(false);
    }
  }

  async function onClickHandler(roomId) {
  try {
    await api.post(`/chat/rooms/${roomId}/join`);
    navigate(`/study/discussions/${roomId}`);
  } catch (error) {
    toast(<ErrorToast message={"Failed to join room"} />);
  }
}

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="bg-black p-8 w-full min-h-screen flex gap-4 flex-col">
      <PageHeader title={"Discussions"} />
      <AddComponent
        meta="Want to discuss a topic?"
        buttonText="Start a discussion"
        icon={Plus}
        onClick={() => setDialogOpen(true)}
      />
      <Dialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-1 w-90">
            <h1>Title</h1>
            <input
              type="text"
              placeholder="Enter the room title"
              value={discussionRoomForm.name}
              onChange={(e) =>
                setDiscussionRoomForm({
                  ...discussionRoomForm,
                  name: e.target.value,
                })
              }
              className="text-text-secondary focus:outline-none focus:border-white/30 border-b border-white/15 py-1 px-2 w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1>Description</h1>
            <input
              type="text"
              placeholder="Enter the room description"
              value={discussionRoomForm.subject}
              onChange={(e) =>
                setDiscussionRoomForm({
                  ...discussionRoomForm,
                  subject: e.target.value,
                })
              }
              className="text-text-secondary focus:outline-none focus:border-white/30 border-b border-white/15 py-1 px-2 w-full"
            />
          </div>
          <button
            onClick={submitForm}
            className=" bg-bg-secondary rounded-full py-2 px-4 cursor-pointer flex justify-center items-center gap-2 text-sm text-text-secondary hover:text-white border border-black hover:border-white/15 duration-200 ease-in-out"
          >
            Create Room
          </button>
        </div>
      </Dialog>
      {loading ? "Loading..." : roomList.map((rooms, index) => {
        return (
          <div
            key={rooms._id}
            className="flex flex-col border border-white/15 duration-300 p-4 rounded-lg gap-6 hover:border-white/30"
          >
            <div className="flex justify-between">
              <div className="text-xs flex items-center justify-center gap-1">
                <div className="w-6 h-6 gap-1 rounded-full bg-white/30 p-px">
                  <img
                    src={
                      rooms.createdBy.avatar
                        ? rooms.createdBy.avatar
                        : "/assets/user-round.svg"
                    }
                    className="rounded-full object-cover"
                    alt=""
                  />
                </div>
                <h1>{rooms.createdBy.username}</h1>
              </div>
              {rooms.isActive ? (
                <div className="text-xs px-2 py-1 rounded-full flex bg-red-500 text-black gap-1">
                  {" "}
                  Live
                </div>
              ) : (
                <div className="text-xs px-2 py-1 rounded-full bg-text-secondary text-black">
                  Ended
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 px-2">
              <h1>{rooms.name}</h1>
              {rooms.subject && (
                <p className="text-text-secondary">{rooms.subject}</p>
              )}
            </div>
            <button
              onClick={() => onClickHandler(rooms._id)}
              className=" bg-bg-secondary rounded-full py-3 px-4 cursor-pointer flex justify-center items-center gap-2 text-sm text-text-secondary hover:text-white border border-black hover:border-white/15 duration-200 ease-in-out w-fit"
            >
              Join Discussion
              <Plus size={18} strokeWidth={1} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DiscussionsPage;
