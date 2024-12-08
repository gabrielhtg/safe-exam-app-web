import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/app/_slices/userSlice'

export default configureStore({
  reducer: {
    user: userReducer,
  },
})
