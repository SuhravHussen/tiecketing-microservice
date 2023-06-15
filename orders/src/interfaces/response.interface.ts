import { Response } from "express";
interface res {
  message: string;
  data: any;
  error: boolean;
}

export type MyCustomResponse = Response<res>;
