import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { parse } from "papaparse";
import mysql from "mysql2/promise";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({});
  const [fields, files] = await new Promise<any[]>((resolve, reject) => {
    form.parse(req, (err: any, fields: formidable.Fields, files: formidable.Files) => {
      if (err) reject(err);
      else resolve([fields, files]);
    });
  });

  // ...lanjut proses seperti sebelumnya
}
