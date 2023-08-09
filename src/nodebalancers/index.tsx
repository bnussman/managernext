import { Route, Routes } from "react-router-dom";
import { NodeBalancers } from "./NodeBalancers";
import { NodeBalancer } from "./NodeBalancer";

export function NodeBalancerRouter() {
  return (
    <Routes>
      <Route path="/:id/:tab?" element={<NodeBalancer />} />
      <Route path="/" element={<NodeBalancers />} />
    </Routes>
  );
}