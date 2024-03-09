
interface PaginationResult<T> {
  currentItems: T[]
  totalPages: number
  currentPage: number
}

export function paginate<T>(items: T[], currentPage: number, itemsPerPage: number): PaginationResult<T> {
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(items.length / itemsPerPage)

  return {
    currentItems,
    totalPages,
    currentPage,
  }
}
