export function currentStock(movements) {
  return movements.reduce((total, movement) => {
    if (movement.type === "out") {
      return total - movement.quantity
    }
    return total + movement.quantity
  }, 0)
}