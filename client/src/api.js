const BASE = import.meta.env.VITE_API_URL || "/api"

export async function request(path, options = {}) {
  const response = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error((data && data.error) || `Request failed (${response.status})`)
  }

  return data
}

export const api = {
  getProducts: () => request("/products"),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (product) =>
    request("/products", { method: "POST", body: JSON.stringify(product) }),
  updateProduct: (id, product) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(product) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),
  
  getMovements: (productId) =>
    request(productId ? `/movements?productId=${productId}` : "/movements"),
  createMovement: (movement) =>
    request("/movements", { method: "POST", body: JSON.stringify(movement) }),
    getSummary: () => request("/reports/summary"),
  getLowStock: () => request("/reports/low-stock"),
}