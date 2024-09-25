import Keycloak  from "keycloak-js";
import type { KeycloakConfig } from "keycloak-js";

export default defineNuxtPlugin((nuxtApp) => {
	const runtimeConfig = useRuntimeConfig();

	const initOptions: KeycloakConfig = {
		url: runtimeConfig.authUrl,
		realm: runtimeConfig.authRealm,
		clientId: runtimeConfig.authClientId,
	};

	const keycloak = new Keycloak(initOptions);

	nuxtApp.$keycloak = keycloak;
	keycloak.init({
		// Use 'login-required' to always require authentication
		// If using 'login-required, check-sso', there is no need for the router guards in router.js -  check-sso
		onLoad: "check-sso",
	});

	console.log("KeyCloak Plugin Loaded: ", nuxtApp.$keycloak);
});
