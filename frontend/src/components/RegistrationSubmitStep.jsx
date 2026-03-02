const RegistrationSubmitStep = ({ form, setForm }) => {
  return (
    <div className="py-4 px-12">
      <div className="bg-bg-secondary rounded-lg px-8 py-4 flex flex-col gap-4">
        <div className="flex items-center bg-black rounded-full gap-4">
          <div className="w-20 h-20 rounded-full bg-white">
            <img
              src={form.avatar}
              className="object-cover w-20 h-20 rounded-full"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-1">
            <h1 className="font-medium text-lg">{form.username}</h1>
            <h1 className="text-sm text-text-secondary">{form.email}</h1>
          </div>
        </div>
        {form.skills.length !== 0 ? (
          <div className="flex flex-col bg-black rounded-2xl gap-2 px-4 py-2">
            <h1 className="text-sm text-text-primary">Skills</h1>
            <div className="flex gap-1 flex-wrap">
              {form.skills.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="text-xs text-text-secondary bg-white/15 py-1 px-2 w-fit rounded-full"
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
        {form.department && (
          <div className="flex flex-col bg-black rounded-2xl gap-2 px-4 py-2">
            <h1 className="text-sm text-text-primary">Department</h1>
            <h1 className="text-sm text-text-secondary">
              {form.department?.toUpperCase()}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationSubmitStep;
