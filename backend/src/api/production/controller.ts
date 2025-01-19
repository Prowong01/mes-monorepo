// import { Request, Response } from "express";
// import {
//     fetchProductionOrders,
//     addProductionOrder,
//     modifyProductionOrder,
//     removeProductionOrder,
// } from "./service";
//
// export const getProductionOrders = async (req: Request, res: Response) => {
//     try {
//         const orders = await fetchProductionOrders();
//         res.json(orders);
//     } catch (err) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
//
// export const createProductionOrder = async (req: Request, res: Response) => {
//     try {
//         const newOrder = await addProductionOrder(req.body);
//         res.json(newOrder);
//     } catch (err) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
//
// // 其他控制器函数...