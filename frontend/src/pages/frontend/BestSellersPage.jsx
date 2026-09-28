import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BookCollectionPage from "./BookCollectionPage.jsx";

function BestSellersPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${import.meta.env.VITE_API}/api/book?all=true&limit=200`, { signal: controller.signal })
      .then(({ data }) => {
        const list = data?.data ?? data ?? [];
        setBooks(list.filter((book) => book?.isActive !== false));
      })
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const bestSellerBooks = useMemo(
    () =>
      [...books]
        .sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
        .slice(0, 20),
    [books]
  );

  return (
    <BookCollectionPage
      title="Best Sellers"
      subtitle="Most loved books by students and parents across our store."
      emptyMessage="No bestseller books are available right now."
      booksOverride={bestSellerBooks}
      action={{ to: "/", label: "Back to home" }}
    />
  );
}

export default BestSellersPage;
