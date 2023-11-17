// import { createProxyMiddleware } from "http-proxy-middleware";

// // eslint-disable-next-line import/no-anonymous-default-export
// export default (req, res) => {
//   let proxy = createProxyMiddleware({
//     // default proxy object
//     target: "https://api.dify.ai",
//     changeOrigin: true,
//     pathRewrite: { [`^/api/proxy`]: "" },
//     onProxyRes: function (proxyRes, req, res) {
//       proxyRes.headers["Access-Control-Allow-Origin"] = "*";
//     },
//     router: {
//       "/api/loripsum": "https://loripsum.net/api",
//     },
//   });
//   return proxy(req, res);
// };

// export const config = {
//   api: {
//     bodyParser: false,
//     externalResolver: true,
//   },
// };
