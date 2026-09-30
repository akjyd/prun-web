import { useEffect, useState } from "react";
import type { Bank } from "./types";
import { fetchBanks } from "./api";
import BankTable from "./BankTable";

/** 取数据 + 三个状态。展示组件见 BankTable  */
export default function Banks() {
  const [banks, setBanks] = useState<Bank[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async function () {
      try {
        const data = await fetchBanks();
        setBanks(data);
      } catch (e) {
        if (e instanceof Error) setError(e);

        console.error(e);
      }
    })();
  }, []);

  if (error) return <div>加载出错</div>;
  if (banks === null) return <div>加载中...</div>;

  return <BankTable banks={banks} />;
}
