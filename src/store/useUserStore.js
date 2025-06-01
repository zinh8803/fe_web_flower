import { create } from "zustand";

const useUserStore = create((set) => ({
    users: [],
    setUsers: (users) => set({ users }),
}));

export default useUserStore;
