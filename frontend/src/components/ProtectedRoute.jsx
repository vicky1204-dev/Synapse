import {useAuth} from "../auth/useAuth.js"

const ProtectedRoute = ({children}) => {
  const {user, loading} = useAuth()

  return (
  <>
  {loading ? <div>...loading</div> : !user ? <div>Log In Please</div> : children}
  </>
  )
}

export default ProtectedRoute