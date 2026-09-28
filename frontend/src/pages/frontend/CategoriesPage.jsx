import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookCollectionPage from "./BookCollectionPage.jsx";

function CategoriesPage() {
  const { categoryId } = useParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      axios.get(`${import.meta.env.VITE_API}/api/book/category`, { signal: controller.signal }),
      axios.get(`${import.meta.env.VITE_API}/api/book?all=true&limit=200`, { signal: controller.signal }),
    ])
      .then(([categoriesRes, booksRes]) => {
        const categoryItems = categoriesRes.data?.data ?? categoriesRes.data ?? [];
        const bookItems = booksRes.data?.data ?? booksRes.data ?? [];

        setCategories(categoryItems);
        setBooks(bookItems.filter((book) => book?.isActive !== false));
      })
      .catch(() => {
        setCategories([]);
        setBooks([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const selectedCategory = useMemo(
    () => categories.find((category) => String(category._id ?? category.id) === String(categoryId)),
    [categories, categoryId]
  );

  if (categoryId) {
    const categoryBooks = books.filter((book) => {
      const bookCategory = book?.category;
      const categoryValue = typeof bookCategory === "object" ? bookCategory?._id : bookCategory;
      return String(categoryValue ?? "") === String(categoryId);
    });

    return (
      <BookCollectionPage
        title={selectedCategory?.name || "Category Books"}
        subtitle={selectedCategory?.description || "Explore books in this collection."}
        emptyMessage="No books are available in this category right now."
        booksOverride={categoryBooks}
        action={{ to: "/categories", label: "Browse all categories" }}
      />
    );
  }

  return (
    <div className="bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-700">Browse</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-600">Find books by subject, class level, or academic stream.</p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6">
                <div className="h-5 w-28 rounded bg-gray-200" />
                <div className="mt-4 h-4 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : categories.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category._id ?? category.id}
                to={`/categories/${category._id ?? category.id}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                    {category.name?.charAt(0)?.toUpperCase() || "B"}
                  </span>
                  <span className="text-xs font-medium text-gray-500">{category.totalBooks ?? 0} books</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                  {category.description || "Explore books in this category and find the right pick for your studies."}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            No categories are available right now.
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;
