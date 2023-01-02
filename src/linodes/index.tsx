import { Route, Routes } from "react-router-dom";
import { Create } from "./Create";
import { Linode } from "./Linode";
import { Linodes } from "./Linodes";

export function LinodeRouter() {
  return (
    <Routes>
      <Route path="/create" element={<Create />} />
      <Route path="/:id/:tab" element={<Linode />} />
      <Route path="/:id" element={<Linode />} />
      <Route path="/" element={<Linodes />} />
    </Routes>
  );
}