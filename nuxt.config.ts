// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	ssr: true,
	runtimeConfig: {
		gwEndPoint: "",

		public: {
			authClientId: "",
			authRealm: "",
			authUrl: "",
			stripeKey: "",
		},
	},
	modules: ["nuxt-quasar-ui", "@pinia/nuxt", "@vite-pwa/nuxt"],
	pinia: {
		storesDirs: ["./stores/*"],
	},
	imports: { dirs: ["stores"] },
	pwa: {
		strategies: "injectManifest",
		registerType: "autoUpdate",
		manifest: {
			name: "temporah",
			short_name: "Temporah",

			lang: "en",
			start_url: "abc.com",
			display: "standalone",
      orientation: "portrait",
			background_color: "#fff3e0",
			theme_color: "#fff3e0",
		},
		client: {
			installPrompt: true,
			periodicSyncForUpdates: 3600,
		},
		workbox: {
			navigateFallback: "/",
			navigateFallbackAllowlist: [/^\/$/],
			suppressWarnings: true,
			globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
		},
		injectManifest: {
			globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
		},
		devOptions: {
			enabled: true,
			type: "module",
		},
	},
});

