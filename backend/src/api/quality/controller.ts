// import { Request, Response } from "express";
// import {
//     fetchQualityChecks,
//     addQualityCheck,
//     modifyQualityCheck,
//     removeQualityCheck,
// } from "./service";
//
// export const getQualityChecks = async (req: Request, res: Response) => {
//     try {
//         const checks = await fetchQualityChecks();
//         res.json(checks);
//     } catch (err) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
//
// export const createQualityCheck = async (req: Request, res: Response) => {
//     try {
//         const newCheck = await addQualityCheck(req.body);
//         res.json(newCheck);
//     } catch (err) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
//
// // 其他控制器函数...