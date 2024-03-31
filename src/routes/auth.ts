import { Router as expressRouters, Request, Response } from "express";

const authRoutes = expressRouters();

authRoutes.route('/signup').post((req:Request, res:Response) => {
  console.log("Signup route hit!");
  res.send('Signup route');
});

export default authRoutes;
