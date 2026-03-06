export default {

async fetch(request, env) {

const url = new URL(request.url)
const path = url.pathname
const method = request.method
const host = url.hostname
const subdomain = host.split(".")[0]

const cors = {
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
"Access-Control-Allow-Headers": "Content-Type"
}

function json(data,status=200){
return new Response(JSON.stringify(data),{
status,
headers:{...cors,"Content-Type":"application/json"}
})
}

if(method === "OPTIONS"){
return new Response("",{headers:cors})
}

try{

// ============================
// HEALTH
// ============================

if(path === "/api/health"){
return json({status:"ok"})
}

// ============================
// SUBDOMAIN STORE ROUTING
// ============================

if(!path.startsWith("/api/")){

if(subdomain && subdomain !== "www" && subdomain !== "creatutienda"){

const storeId = await env.INDEX.get(`store:slug:${subdomain}`)

if(storeId){

const store = await env.STORES.get(`store:${storeId}`,"json")

return new Response(JSON.stringify(store.config),{
headers:{
"Content-Type":"application/json"
}
})

}

}

}

// ============================
// REGISTER
// ============================

if(path === "/api/platform/register" && method === "POST"){

const body = await request.json()

const {name,lastName,email,password,birth} = body

if(!email || !password){
return json({error:"Missing email or password"},400)
}

const existing = await env.INDEX.get(`user:email:${email}`)

if(existing){
return json({error:"User already exists"},409)
}

const userId = crypto.randomUUID()

const passwordHash = await hashPassword(password)

const user = {
id:userId,
name,
lastName,
email,
passwordHash,
birth,
createdAt:Date.now()
}

await env.USERS.put(`user:${userId}`,JSON.stringify(user))

await env.INDEX.put(`user:email:${email}`,userId)

return json({userId})

}

// ============================
// LOGIN
// ============================

if(path === "/api/platform/login" && method === "POST"){

const body = await request.json()

const {email,password} = body

const userId = await env.INDEX.get(`user:email:${email}`)

if(!userId){
return json({error:"Invalid credentials"},401)
}

const user = await env.USERS.get(`user:${userId}`,"json")

if(!user){
return json({error:"Invalid credentials"},401)
}

const valid = await verifyPassword(password,user.passwordHash)

if(!valid){
return json({error:"Invalid credentials"},401)
}

return json({userId})

}

// ============================
// CREATE STORE
// ============================

if(path === "/api/platform/store" && method === "POST"){

const body = await request.json()

const {userId,slug,name,config} = body

if(!userId || !slug){
return json({error:"Missing userId or slug"},400)
}

const existing = await env.INDEX.get(`store:slug:${slug}`)

if(existing){
return json({error:"Slug already exists"},409)
}

const storeId = crypto.randomUUID()

const store = {
id:storeId,
ownerId:userId,
slug,
name,
config:config || {},
createdAt:Date.now()
}

await env.STORES.put(`store:${storeId}`,JSON.stringify(store))

await env.INDEX.put(`store:slug:${slug}`,storeId)

let userStores = await env.USERS.get(`user:stores:${userId}`,"json") || []

userStores.push(storeId)

await env.USERS.put(`user:stores:${userId}`,JSON.stringify(userStores))

return json({storeId,slug})

}

// ============================
// GET USER STORES
// ============================

if(path === "/api/platform/stores"){

const userId = url.searchParams.get("userId")

if(!userId){
return json({error:"Missing userId"},400)
}

const storeIds = await env.USERS.get(`user:stores:${userId}`,"json") || []

const stores = []

for(const id of storeIds){

const store = await env.STORES.get(`store:${id}`,"json")

if(store){
stores.push(store)
}

}

return json(stores)

}

// ============================
// STORE PUBLIC CONFIG
// ============================

if(path.startsWith("/api/store/")){

const slug = path.split("/")[3]

const storeId = await env.INDEX.get(`store:slug:${slug}`)

if(!storeId){
return json({error:"Store not found"},404)
}

const store = await env.STORES.get(`store:${storeId}`,"json")

return json(store.config)

}

return json({error:"Not found"},404)

}catch(err){

return json({error:"Server error",details:err.message},500)

}

}

}

// ============================
// PASSWORD HASH
// ============================

async function hashPassword(password){

const enc = new TextEncoder().encode(password)

const hash = await crypto.subtle.digest("SHA-256",enc)

return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,"0")).join("")

}

async function verifyPassword(password,hash){

const newHash = await hashPassword(password)

return newHash === hash

}
