export const state = () => ({
    isLoggedIn: false,
    user: {
        name: '',
        email: '', 
    }
});

export const mutations = {
    login(state) {
        state.user.name = "Admin";
        state.isLoggedIn = true;
    },
    logout(state) {
        state.isLoggedIn = false;
        state.user.name = "";
    }
};