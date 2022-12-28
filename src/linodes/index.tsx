import { Route, Routes } from "react-router-dom";
import { Linode } from "./Linode";
import { Linodes } from "./Linodes";

export function LinodeRouter() {
  return (
    <Routes>
      <Route path="/:id" element={<Linode />} />
      <Route path="/" element={<Linodes />} />
    </Routes>
  );
}