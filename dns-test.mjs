import dns from "node:dns";

dns.resolveSrv(
  "_mongodb._tcp.cluster0.smyezhg.mongodb.net",
  (err, records) => {
    console.log("Error:", err);
    console.log("Records:", records);
  }
);