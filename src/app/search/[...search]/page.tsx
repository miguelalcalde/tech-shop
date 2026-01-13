export default function SearchPage({
  params,
}: {
  params: { search: string[] };
}) {
  const searchTerm = params.search.join("/");

  return <div>Search term: {searchTerm}</div>;
}
