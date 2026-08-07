import { useEffect, useState } from 'react';
import { getWalletSummary } from '../api/dashboardApi';

export default function useWalletSummary() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getWalletSummary()
      .then((data) => {
        if (mounted) setWallet(data);
      })
      .catch(() => {
        if (mounted) setWallet(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { wallet, loading };
}
