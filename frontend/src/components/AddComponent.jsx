const AddComponent = (props) => {
    const Icon = props.icon
  return (
    <div className="flex justify-between items-center p-4 border border-white/20 rounded-lg text-text-secondary">
        <div>{props.meta}</div>
        <button 
onClick={props.onClick}
        className="border border-white/30 bg-bg-secondary rounded-full py-2 px-4 cursor-pointer flex text-white justify-center items-center gap-2 text-sm hover:text-black hover:bg-white duration-300 ease-in-out">
          {props.buttonText}
          <Icon size={18} strokeWidth={1}/>
        </button>
      </div>
  )
}

export default AddComponent