import axios from "axios";

const API = import.meta.env.VITE_API;

// ==========================================
// Get reviews
// ==========================================
export const getReview = async () => {
    try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
            `${API}/api/review`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const reviews = res?.data || [];

        return reviews;
    } catch (error) {
        console.error(
            "Get Review Error:",
            error.response?.data || error.message
        );

        throw (
            error?.response?.data || {
                message: "Failed to fetch review data",
            }
        );
    }
};

// ==========================================
// Get reviews with users and books
// ==========================================
export const getReview1 = async () => {
    try {
        const token = localStorage.getItem("token");

        const authConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const [usersRes, booksRes, reviewRes] =
            await Promise.all([
                axios.get(
                    `${API}/api/user`,
                    authConfig
                ),

                axios.get(
                    `${API}/api/book`,
                    authConfig
                ),

                axios.get(
                    `${API}/api/review`,
                    authConfig
                ),
            ]);

        // ==========================================
        // Normalize API responses
        // ==========================================

        const users = Array.isArray(usersRes.data)
            ? usersRes.data
            : usersRes.data?.data || [];

        const books = Array.isArray(booksRes.data)
            ? booksRes.data
            : booksRes.data?.data || [];

        const reviews = Array.isArray(reviewRes.data)
            ? reviewRes.data
            : reviewRes.data?.review ||
              reviewRes.data?.data ||
              [];

        // ==========================================
        // Attach book and user to every review
        // ==========================================

        const updatedReviews = reviews.map((review) => {
            const book = books.find(
                (book) =>
                    String(book._id) ===
                    String(review.bookId)
            );

            const user = users.find(
                (user) =>
                    String(user._id) ===
                    String(review.userId)
            );

            return {
                ...review,
                book: book || null,
                user: user || null,
            };
        });

        return updatedReviews;
    } catch (error) {
        console.error(
            "Get Review Error:",
            error.response?.data || error.message
        );

        throw (
            error?.response?.data || {
                message: "Failed to fetch review data",
            }
        );
    }
};