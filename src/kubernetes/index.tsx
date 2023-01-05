import { Route, Routes } from "react-router-dom";
import { Kubernetes } from "./Kubernetes";

export function KubernetesRouter() {
  return (
    <Routes>
      <Route path="/" element={<Kubernetes />} />
    </Routes>
  );
}