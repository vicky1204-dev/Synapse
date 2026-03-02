import {X} from "lucide-react"

const Pill = ({text, onClick}) => {
  return (
    <span className='bg-bg-secondary text-sm text-text-secondary px-4 py-2 rounded-full flex gap-1 items-center hover:cursor-pointer hover:bg-white/15 duration-300' onClick={onClick}>
        {text} <X size={14}/>
    </span>
  )
}

export default Pill