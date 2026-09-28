import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BookCollectionPage from "./BookCollectionPage.jsx";

function NewArrivalsPage() {
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

  const newArrivalBooks = useMemo(
    () =>
      [...books]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 20),
    [books]
  );

  return (
    <BookCollectionPage
      title="New Arrivals"
      subtitle="Freshly added books, latest editions, and recently stocked classroom essentials."
      emptyMessage="No new arrivals have been added yet."
      booksOverride={newArrivalBooks}
      action={{ to: "/", label: "Back to home" }}
    />
  );
}

export default NewArrivalsPage;
