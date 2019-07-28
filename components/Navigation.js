export default {
    template: `
    <nav class="bg-blue-700">
        <div class="container mx-auto flex items-center justify-between flex-wrap px-2 py-4">
            <router-link to="/series" class="flex items-center flex-shrink-0 text-white mr-6">
                <span class="font-serif leading-none text-4xl mr-4">J</span>
                <span class="font-semibold text-xl tracking-tight">J-Novel Unofficial Reader App</span>
            </router-link>
            <div class="block lg:hidden">
                <button class="flex items-center px-3 py-2 border rounded text-blue-200 border-blue-400 hover:text-white hover:border-white">
                    <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>
            </div>
            <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div class="text-sm lg:flex-grow lg:flex lg:justify-end">
                    <router-link to="/series" class="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        Series
                    </router-link>
                    <router-link to="/feed" class="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        Feed
                    </router-link>
                    <router-link to="/coming-up" class="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                        Coming Up
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
  `,
    data() {
        return {}
    }
}
