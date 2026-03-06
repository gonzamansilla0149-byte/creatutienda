const API_BASE = "https://creatutienda.gonzamansilla0149.workers.dev"

export async function api(path, options = {}) {

    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    })

    if (!res.ok) {
        throw new Error("API error")
    }

    return res.json()
}
