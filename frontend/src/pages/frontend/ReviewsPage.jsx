import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Review from "../../components/frontend/Review.jsx";

function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const token = localStorage.getItem("token"); 

        Promise.all([
            axios.get(`${import.meta.env.VITE_API}/api/review`,
                {
                    signal: controller.signal,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            axios.get(`${import.meta.env.VITE_API}/api/book?all=true&limit=200`, { signal: controller.signal }),
        ])
            .then(([reviewsRes, booksRes]) => {
                const list = reviewsRes.data?.review ?? reviewsRes.data?.data ?? reviewsRes.data ?? [];
                const books = booksRes.data?.data ?? booksRes.data ?? [];
                const bookMap = new Map(books.map((book) => [String(book._id), book]));

                const approvedReviews = list
                    .filter((review) => review?.approved)
                    .map((review) => ({
                        ...review,
                        book: bookMap.get(String(review.bookId)) || null,
                    }));

                setReviews(approvedReviews);
            })
            .catch(() => setReviews([]))
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    const averageRating = useMemo(() => {
        if (!reviews.length) return 0;
        const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
        return total / reviews.length;
    }, [reviews]);

    return (
        <div className="bg-slate-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-700">Reader feedback</p>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">Customer Reviews</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Honest opinions from students and parents who have read our books.
                        </p>
                    </div>

                    <div className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
                        {reviews.length} approved review{reviews.length === 1 ? "" : "s"}
                    </div>
                </div>

                {loading ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
                                <div className="h-4 w-24 rounded bg-gray-200" />
                                <div className="mt-4 h-5 w-2/3 rounded bg-gray-200" />
                                <div className="mt-3 h-4 w-full rounded bg-gray-200" />
                                <div className="mt-2 h-4 w-5/6 rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                ) : reviews.length ? (
                    <>
                        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-800">
                            <span className="font-semibold">Average rating:</span>
                            <Review rating={averageRating} size={16} />
                            <span className="font-medium">{averageRating.toFixed(1)} / 5</span>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {reviews.map((review) => (
                                <article key={review._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <Review rating={review.rating} size={15} />
                                        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            {new Date(review.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-semibold text-gray-900">{review.title}</h2>

                                    {review.book ? (
                                        <Link
                                            to={`/products/${review.book._id}`}
                                            className="mt-2 inline-block text-sm font-medium text-blue-700 hover:text-blue-900"
                                        >
                                            {review.book.name}
                                        </Link>
                                    ) : (
                                        <p className="mt-2 text-sm font-medium text-gray-500">Book review</p>
                                    )}

                                    <p className="mt-4 text-sm leading-6 text-gray-600">{review.body}</p>
                                </article>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
                        No approved reviews are available right now. Please check back soon.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReviewsPage;
