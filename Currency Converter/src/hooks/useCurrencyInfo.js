import { useEffect, useState } from "react";

function useCurrencyInfo(baseCurrency) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency.toUpperCase()}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.rates); // updated key
      })
      .catch((err) => {
        console.error("Currency API fetch failed:", err);
        setData({});
      });
  }, [baseCurrency]);

  return data;
}

export default useCurrencyInfo;
