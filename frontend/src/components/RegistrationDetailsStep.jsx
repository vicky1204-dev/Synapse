import {UserPen, Mail, Lock} from "lucide-react"

const RegistrationDetailsStep = ({ form, setForm }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="gap-1 flex flex-col">
          <span className="flex gap-2 items-center ml-2"> <UserPen size={18}/> Username <span className="text-xs text-text-secondary">(required)</span></span>
      <input
        className="text-text-secondary focus:outline-none focus:border-white/30  border-b border-white/15 py-1 px-2 w-full"
        placeholder="Type a username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        value={form.username}
      />
      </div>
   <div className="gap-1 flex flex-col">
    <span className="flex gap-2 items-center ml-2"> <Mail size={18}/> Email <span className="text-xs text-text-secondary">(required)</span></span>
      <input
        className="text-text-secondary focus:outline-none focus:border-white/30  border-b border-white/15 py-1 px-2 w-full"
        placeholder="example@example.com"
        type="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        value={form.email}
      />
   </div>
   <div className="gap-1 flex flex-col">
    <span className="flex gap-2 items-center ml-2"> <Lock size={18}/> Password <span className="text-xs text-text-secondary">(required)</span></span>
      <input
        className="text-text-secondary focus:outline-none focus:border-white/30 border-b border-white/15 py-1 px-2 w-full"
        placeholder="Enter a strong password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
   </div>
    </div>
  );
};

export default RegistrationDetailsStep;
