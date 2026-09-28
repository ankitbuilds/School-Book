import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/frontend/ProductCard.jsx";
import { BookContext } from "../../context/School.jsx";

function BookCollectionPage({
  title,
  subtitle,
  emptyMessage = "No books found.",
  filter = () => true,
  booksOverride,
  action,
}) {
  const { books, booksLoading } = useContext(BookContext);

  const displayBooks = useMemo(() => {
    const source = booksOverride ?? books;
    return source.filter((book) => book?.isActive !== false && filter(book));
  }, [books, booksOverride, filter]);

  return (
    <div className="bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-700">SchoolBook</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
          </div>

          {action && (
            <Link
              to={action.to}
              className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              {action.label}
            </Link>
          )}
        </div>

        {booksLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded mt-3" />
                <div className="h-3 bg-gray-200 rounded mt-2 w-2/3" />
              </div>
            ))}
          </div>
        ) : displayBooks.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayBooks.map((book) => (
              <ProductCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCollectionPage;
