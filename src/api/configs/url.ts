import { Http } from "./http";

export const baseApi = new Http(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api");
