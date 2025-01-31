// pages/api/reserve-account.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getMonnifyToken } from '@/utils/monnify';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { accountReference, accountName, customerEmail, customerName, bvn } = req.body;
      const accessToken = await getMonnifyToken();

      const response = await axios.post(
        'https://api.monnify.com/api/v2/bank-transfer/reserved-accounts',
        {
          accountReference,
          accountName,
          currencyCode: 'NGN',
          contractCode: process.env.MONNIFY_CONTRACT_CODE,
          customerEmail,
          bvn,
          customerName,
          getAllAvailableBanks: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}