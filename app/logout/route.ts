"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { NextApiRequest, NextApiResponse } from 'next';

export async function logout() {
    const supabase = createClient();
  
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error)
      redirect("/error");
    }
  
    return 'Logged out';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const result = await logout();
        res.status(200).send(result);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}