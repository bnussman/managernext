import { Route, Routes } from "react-router-dom";
import { Cluster } from "./Cluster";
import { Clusters } from "./Clusters";
import { Create } from "./Create";

export function KubernetesRouter() {
  return (
    <Routes>
      <Route path="/create" element={<Create />} />
      <Route path="/:id" element={<Cluster />} />
      <Route path="/" element={<Clusters />} />
    </Routes>
  );
}