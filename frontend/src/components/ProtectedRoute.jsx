import {useAuth} from "../auth/useAuth.js"

const ProtectedRoute = ({children}) => {
  const {user, loading} = useAuth()

  return (
  <>
  {loading && <div>...loading</div>}
  {!user && <div>Sign In pleeeeaèeeeeeeeeeeeeeeeeee</div>}
  </>
  )
}

export default ProtectedRoute