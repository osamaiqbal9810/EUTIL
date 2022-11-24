export function checkUserLogin() {
	let token = localStorage.getItem("access_token");
	if (token) {
		return true;
	} else {
		return false;
	}
}
