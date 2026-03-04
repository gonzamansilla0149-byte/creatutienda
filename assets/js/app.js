import { register, getSession } from "./auth.js"
import { openModal } from "./ui.js"


const loginBtn = document.getElementById("loginBtn")
const createStoreBtn = document.getElementById("createStoreBtn")
const registerBtn = document.getElementById("registerSubmit")



/* LOGIN CLICK */

loginBtn?.addEventListener("click", () => {
    openModal("loginModal")
})



/* CREATE STORE CLICK */

createStoreBtn?.addEventListener("click", () => {

    const user = getSession()

    if (!user) {
        openModal("registerModal")
    } else {
        window.location.href = "dashboard.html"
    }

})



/* REGISTER */

registerBtn?.addEventListener("click", async () => {

    const email = document.getElementById("registerEmail").value

    const data = await register(email)

    window.location.href = "dashboard.html"

})
