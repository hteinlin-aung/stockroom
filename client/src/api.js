//   1. call fetch()
//   2. if the response is NOT ok, read the error message the server sent
//      and throw an Error with it (so the page can show it to the user)
//   3. if it is ok, return the parsed JSON

export async function request(path, options = {}) {
  const response = await fetch("/api" + path, {
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
}