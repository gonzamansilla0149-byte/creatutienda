import { register, login } from "./auth.js"
// ============================
// ELEMENTOS
// ============================

const loginBtn = document.getElementById("loginBtn")
const createStoreBtn = document.getElementById("createStoreBtn")
const createStoreHero = document.getElementById("createStoreHero")
const createStoreCTA = document.getElementById("createStoreCTA")

const loginModal = document.getElementById("loginModal")
const registerModal = document.getElementById("registerModal")

const loginSubmit = document.getElementById("loginSubmit")
const registerSubmit = document.getElementById("registerSubmit")


// ============================
// CONFIG API
// ============================

const API_BASE = "https://creatutienda.gonzamansilla0149.workers.dev/api"

// ============================
// SESIÓN
// ============================

function getSession(){
    return localStorage.getItem("userId")
}

function setSession(userId){
    localStorage.setItem("userId", userId)
}


// ============================
// MODALS
// ============================

function openLogin(){
    loginModal.style.display = "flex"
}

function openRegister(){
    registerModal.style.display = "flex"
}

function closeModals(){
    loginModal.style.display = "none"
    registerModal.style.display = "none"
}

// cerrar modal al hacer click fuera
window.addEventListener("click", (event) => {

    if(event.target === loginModal){
        closeModals()
    }

    if(event.target === registerModal){
        closeModals()
    }

})

// cerrar modal con tecla ESC
document.addEventListener("keydown", (event) => {

    if(event.key === "Escape"){
        closeModals()
    }

})
// ============================
// BOTONES LOGIN
// ============================

loginBtn?.addEventListener("click", openLogin)


// ============================
// BOTONES CREAR TIENDA
// ============================

function handleCreateStore(){

    const user = getSession()

    if(!user){

        openRegister()

    }else{

        window.location.href = "dashboard.html"

    }

}

createStoreBtn?.addEventListener("click", handleCreateStore)
createStoreHero?.addEventListener("click", handleCreateStore)
createStoreCTA?.addEventListener("click", handleCreateStore)


// ============================
// REGISTER
// ============================

registerSubmit?.addEventListener("click", async () => {

    const name = document.getElementById("registerName").value
    const lastName = document.getElementById("registerLastName").value
    const birth = document.getElementById("registerBirth").value
    const email = document.getElementById("registerEmail").value
    const password = document.getElementById("registerPassword").value
    const password2 = document.getElementById("registerPassword2").value

    if(!email || !password){
        alert("Completa los campos")
        return
    }

    if(password !== password2){
        alert("Las contraseñas no coinciden")
        return
    }

    try{

const data = await register({
    name,
    lastName,
    birth,
    email,
    password
})
        const data = await res.json()

        if(!data.userId){
            alert("Error creando usuario")
            return
        }

        setSession(data.userId)

        window.location.href = "dashboard.html"

    }catch(err){

        console.error(err)
        alert("Error creando usuario")

    }

})


// ============================
// LOGIN (simple)
// ============================

loginSubmit?.addEventListener("click", async () => {

    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value

    if(!email || !password){
        alert("Completa email y contraseña")
        return
    }

    try{

        await login({
            email,
            password
        })

        window.location.href = "dashboard.html"

    }catch(err){

        console.error(err)
        alert("Credenciales incorrectas")

    }

})
