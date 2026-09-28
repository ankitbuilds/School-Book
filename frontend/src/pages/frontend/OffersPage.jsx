import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BookCollectionPage from "./BookCollectionPage.jsx";

function OffersPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${import.meta.env.VITE_API}/api/book?all=true&limit=200`, { signal: controller.signal })
      .then(({ data }) => {
        const list = data?.data ?? data ?? [];
        setBooks(list.filter((book) => book?.isActive !== false));
      })
      .catch(() => setBooks([]));

    return () => controller.abort();
  }, []);

  const offerBooks = useMemo(
    () =>
      [...books]
        .filter((book) => Number(book.price || 0) <= 399)
        .sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
        .slice(0, 20),
    [books]
  );

  return (
    <BookCollectionPage
      title="Offers"
      subtitle="Save more on value picks and affordable essentials for school and study."
      emptyMessage="There are no active offers right now. Please check back soon."
      booksOverride={offerBooks}
      action={{ to: "/", label: "Back to home" }}
    />
  );
}

export default OffersPage;
