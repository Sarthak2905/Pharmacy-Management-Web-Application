import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(window.localStorage.getItem('auth_user') || 'null'),
  accessToken: window.localStorage.getItem('access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      window.localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      window.localStorage.setItem('access_token', action.payload.accessToken);
      if (action.payload.refreshToken) {
        window.localStorage.setItem('refresh_token', action.payload.refreshToken);
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      window.localStorage.removeItem('auth_user');
      window.localStorage.removeItem('access_token');
      window.localStorage.removeItem('refresh_token');
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
