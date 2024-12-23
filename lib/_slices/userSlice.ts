import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/lib/store'

interface UserState {
  userData: any
}

const initialState: UserState = {
  userData: {},
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload
    },
    clearUser: (state) => {
      state.userData = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export const selectUser = (state: RootState) => state.user.userData

export default userSlice.reducer
