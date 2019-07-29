export default {
    template: `
    <div class="mx-auto max-w-xs">
        <form class="bg-blue-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                    E-mail
                </label>
                <input v-model="email" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="email" placeholder="E-mail">
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                    Password
                </label>
                <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
            </div>
            <div class="flex items-center justify-between">
                <button @click="signIn" class="bg-blue-400 hover:bg-transparent text-gray-700 font-semibold hover:text-gray-800 py-2 px-4 border border-blue-300 hover:border-blue-500 rounded mx-2" type="button">
                    Sign In
                </button>
            </div>
        </form>
    </div>
  `,
    data() {
        return {
            email: "",
            password: ""
        }
    },
    methods: {
        async signIn() {
            let signInResponse = await this.$root.api.signIn(this.email, this.password);
            let authToken = signInResponse.data.id;
            let authExpiresAt = new Date();
            authExpiresAt.setSeconds(authExpiresAt.getSeconds() + signInResponse.data.ttl);
            let userName = signInResponse.data.user.username;
            let userId = signInResponse.data.userId;

            this.$root.sharedStore.setUser({
                userId, userName, auth: { authToken, authExpiresAt }
            });

            this.$emit('signed-in');
        }
    }
}
