import React from "react";
import SearchHeader from "../../../components/Header/SearchHeader";
interface Props {
  hideSearch(): void;
  setSearch(value: string): void;
  search: string;
}
const Searching: React.FC<Props> = ({ hideSearch, search, setSearch }) => (
  <SearchHeader
    onSearchChange={(e) => setSearch((e.target as HTMLInputElement).value)}
    value={search}
    onBack={() => {
      setSearch("");
      hideSearch();
    }}
    placeholder="Search Contacts"
  />
);

export default Searching;
