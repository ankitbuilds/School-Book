import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLoaderData } from "react-router-dom";
import { getCart } from "../../data/cart.js";
import CartTable from "../../components/admin/CartTable.jsx";

function Cart() {
    const loader = useLoaderData();

    // ==========================================
    // Normalize API response to always be an array
    // ==========================================
    const normalizeCarts = (data) => {
        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data?.data)) {
            return data.data;
        }

        if (Array.isArray(data?.items)) {
            return data.items;
        }

        return [];
    };

    const [carts, setCarts] = useState(
        normalizeCarts(loader)
    );

    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // ==========================================
    // Update carts when loader data changes
    // ==========================================
    useEffect(() => {
        setCarts(normalizeCarts(loader));
        setCurrentPage(1);
    }, [loader]);

    // ==========================================
    // Refresh carts
    // ==========================================
    const refresh = useCallback(async () => {
        setRefreshing(true);

        try {
            const data = await getCart();

            setCarts(normalizeCarts(data));
            setCurrentPage(1);
        } catch (error) {
            console.error(
                "Failed to refresh carts:",
                error
            );

            setCarts([]);
        } finally {
            setRefreshing(false);
        }
    }, []);

    // ==========================================
    // Filter carts
    // ==========================================
    const filteredCarts = useMemo(() => {
        const term = search.trim().toLowerCase();

        // Always return an array
        if (!term) {
            return Array.isArray(carts) ? carts : [];
        }

        const cartList = Array.isArray(carts)
            ? carts
            : [];

        return cartList.filter((cart) => {
            // ------------------------------------------
            // User search
            // ------------------------------------------
            const user = cart.user
                ? `
                    ${cart.user.first_name || ""}
                    ${cart.user.last_name || ""}
                    ${cart.user.username || ""}
                    ${cart.user.email || ""}
                `.toLowerCase()
                : "";

            // ------------------------------------------
            // Book search
            // ------------------------------------------
            const hasBook = Array.isArray(cart.items)
                ? cart.items.some((item) =>
                      item.book?.name
                          ?.toLowerCase()
                          .includes(term)
                  )
                : false;

            return (
                user.includes(term) ||
                hasBook
            );
        });
    }, [carts, search]);

    // ==========================================
    // Total pages
    // ==========================================
    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredCarts.length / rowsPerPage
        )
    );

    // ==========================================
    // Keep current page valid
    // ==========================================
    const safePage = Math.min(
        currentPage,
        totalPages
    );

    // ==========================================
    // Pagination
    // ==========================================
    const paginatedCarts = useMemo(() => {
        const start =
            (safePage - 1) * rowsPerPage;

        return filteredCarts.slice(
            start,
            start + rowsPerPage
        );
    }, [
        filteredCarts,
        safePage,
        rowsPerPage,
    ]);

    // ==========================================
    // Rows per page
    // ==========================================
    const handlePaginationChange = (e) => {
        const value = Number(
            e.target.value
        );

        setRowsPerPage(value);
        setCurrentPage(1);
    };

    // ==========================================
    // Previous page
    // ==========================================
    const handlePrevPage = () => {
        setCurrentPage((prev) =>
            Math.max(1, prev - 1)
        );
    };

    // ==========================================
    // Next page
    // ==========================================
    const handleNextPage = () => {
        setCurrentPage((prev) =>
            Math.min(totalPages, prev + 1)
        );
    };

    // ==========================================
    // Pagination text
    // ==========================================
    const startIndex =
        filteredCarts.length === 0
            ? 0
            : (safePage - 1) *
                  rowsPerPage +
              1;

    const endIndex = Math.min(
        safePage * rowsPerPage,
        filteredCarts.length
    );

    // ==========================================
    // Render
    // ==========================================
    return (
        <div className="max-w-7xl mx-auto space-y-4">

            {/* ==================================
                Header
            ================================== */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">

                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Carts
                    </h2>

                    <p className="text-sm text-gray-500">
                        Active carts that haven’t been checked out.
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto bg-white">

                    {/* Search */}
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => {
                            setSearch(
                                e.target.value
                            );
                            setCurrentPage(1);
                        }}
                        placeholder="Search by customer or book..."
                        className="flex-1 sm:w-72 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Refresh */}
                    <button
                        onClick={refresh}
                        disabled={refreshing}
                        className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>
                </div>
            </div>

            {/* ==================================
                Cart Table
            ================================== */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">

                <CartTable
                    paginatedCarts={
                        paginatedCarts
                    }
                />

                {/* ==================================
                    Pagination
                ================================== */}
                <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">

                    {/* Left side */}
                    <div className="flex items-center gap-2">

                        <span>
                            Rows per page:
                        </span>

                        <select
                            value={rowsPerPage}
                            onChange={
                                handlePaginationChange
                            }
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>
                                5 rows
                            </option>

                            <option value={10}>
                                10 rows
                            </option>

                            <option value={20}>
                                20 rows
                            </option>

                            <option value={30}>
                                30 rows
                            </option>
                        </select>

                        <span className="hidden sm:inline">
                            {filteredCarts.length >
                            0
                                ? `Showing ${startIndex}–${endIndex} of ${filteredCarts.length} carts`
                                : "Showing 0 of 0 carts"}
                        </span>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3 justify-end">

                        {/* Previous */}
                        <button
                            onClick={
                                handlePrevPage
                            }
                            disabled={
                                safePage === 1
                            }
                            className={`px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 ${
                                safePage === 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            Prev
                        </button>

                        {/* Page */}
                        <span>
                            Page{" "}
                            <span className="font-semibold text-gray-700">
                                {safePage}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-gray-700">
                                {totalPages}
                            </span>
                        </span>

                        {/* Next */}
                        <button
                            onClick={
                                handleNextPage
                            }
                            disabled={
                                safePage >=
                                totalPages
                            }
                            className={`px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 ${
                                safePage >=
                                totalPages
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;