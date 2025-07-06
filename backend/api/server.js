import app from "../app.js";

if (process.env.NODE_ENV !== "production") {
  const http = await import("http");
  const port = 4000;
  http.createServer(app).listen(port, () => {
    console.log(`🔧 Local server running on port ${port}`);
  });
}

export default function handler(req, res) {
  return app(req, res);
}
