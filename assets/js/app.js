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

const API_BASE = "creatutienda.gonzamansilla0149.workers.dev/api"


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

    const email = document.getElementById("registerEmail").value

    if(!email){
        alert("Ingresa un email")
        return
    }

    try{

        const res = await fetch(`${API_BASE}/platform/user`,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email
            })

        })

        const data = await res.json()

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

loginSubmit?.addEventListener("click", () => {

    const email = document.getElementById("loginEmail").value

    if(!email){
        alert("Ingresa un email")
        return
    }

    /*
    En el futuro:
    buscar usuario por email
    generar token
    */

    alert("Login aún no implementado. Usa 'Crear cuenta'.")

})
