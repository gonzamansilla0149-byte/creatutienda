import { api } from "./api.js"


export async function register(email) {

    const data = await api("/platform/user", {
        method: "POST",
        body: JSON.stringify({ email })
    })

    localStorage.setItem("userId", data.userId)

    return data
}



export function getSession() {
    return localStorage.getItem("userId")
}



export function logout() {
    localStorage.removeItem("userId")
}
