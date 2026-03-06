import { api } from "/assets/js/api.js"


// ============================
// REGISTER
// ============================

export async function register({ name, lastName, birth, email, password }) {

    const data = await api("/platform/register", {
        method: "POST",
        body: JSON.stringify({
            name,
            lastName,
            birth,
            email,
            password
        })
    })

    localStorage.setItem("userId", data.userId)

    return data
}


// ============================
// LOGIN
// ============================

export async function login({ email, password }) {

    const data = await api("/platform/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password
        })
    })

    localStorage.setItem("userId", data.userId)

    return data
}


// ============================
// SESSION
// ============================

export function getSession() {
    return localStorage.getItem("userId")
}


// ============================
// LOGOUT
// ============================

export function logout() {
    localStorage.removeItem("userId")
}
