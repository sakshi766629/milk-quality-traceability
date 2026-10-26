const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export async function getBatches() {
  const r = await fetch(`${API}/batches`);
  if (!r.ok) throw new Error("Could not load batches. Start the server and MongoDB, then seed demo data.");
  return r.json();
}
export async function createBatch(data) {
  const r = await fetch(`${API}/batches`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  const result = await r.json(); if(!r.ok) throw new Error(result.message || "Could not save batch"); return result;
}
export async function analyze(data) {
  const r = await fetch(`${API}/batches/analyze`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  return r.json();
}
export async function addStage(batchId, data) {
  const r = await fetch(`${API}/batches/${batchId}/readings`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  const result = await r.json(); if(!r.ok) throw new Error(result.message || "Could not save stage"); return result;
}
export async function deleteBatch(batchId) {
  const r = await fetch(`${API}/batches/${batchId}`, {method:"DELETE"});
  const result = await r.json(); if(!r.ok) throw new Error(result.message || "Could not delete batch"); return result;
}
