import AxiosInstance from "./AxiosInstance";

export default function URLWithFilters({
  baseURL,
  globalFilter,
  columnFilters,
  pagination,
  sorting,
}) {
  const url = new URL(baseURL, AxiosInstance.defaults.baseURL);

  // Add filtering parameters
  if (globalFilter) {
    url.searchParams.append("search", globalFilter);
  }

  // Add column filters
  columnFilters.forEach((filter) => {
    url.searchParams.append(filter.id, filter.value);
  });

  // Add pagination parameters
  url.searchParams.append("page", pagination.pageIndex + 1); // Django uses 1-based pagination
  url.searchParams.append("page_size", pagination.pageSize);

  // Add sorting parameters
  if (sorting.length) {
    const sort = sorting
      .map((sort) => {
        return sort.desc ? `-${sort.id}` : sort.id;
      })
      .join(",");
    url.searchParams.append("ordering", sort);
  }

  return url.toString();
}
