import { Route, Routes } from "react-router-dom";
import { Cluster } from "./Cluster";
import { Clusters } from "./Clusters";

export function KubernetesRouter() {
  return (
    <Routes>
      <Route path="/:id" element={<Cluster />} />
      <Route path="/" element={<Clusters />} />
    </Routes>
  );
}