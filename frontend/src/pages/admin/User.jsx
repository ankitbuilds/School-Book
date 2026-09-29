// import axios from 'axios';
// import React, { useEffect, useMemo, useState } from 'react'
// import UserTable from '../../components/admin/UserTable';
// import { Link } from 'react-router-dom';

// function User() {
//     const [users, setUsers] = useState([]);
//     const [search, setSearch] = useState("");
//     const [selectedIds, setSelectedIds] = useState([]);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [render, setRender] = useState(false);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const res = await axios.get(`${import.meta.env.VITE_API}/api/user`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );
//                 const apiUsers = res.data || [];
//                 setUsers(apiUsers);
//             } catch (error) {
//                 console.error("Error fetching users:", error.message);
//             }
//         };

//         fetchUsers();
//     }, []);

//     const filteredUsers = useMemo(() => {
//         const term = search?.toLowerCase();
//         return users
//             .filter((user) => user.role !== "admin")
//             .filter(
//                 (b) =>
//                     b.username?.toLowerCase().includes(term) ||
//                     b.email?.toLowerCase().includes(term) ||
//                     b.first_name?.toLowerCase().includes(term) ||
//                     b.last_name?.toLowerCase().includes(term)
//             );
//     }, [users, search]);

//     const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));

//     const paginatedUsers = useMemo(() => {
//         const safePage = Math.min(currentPage, totalPages);
//         const start = (safePage - 1) * rowsPerPage;
//         return filteredUsers.slice(start, start + rowsPerPage);
//     }, [filteredUsers, currentPage, rowsPerPage, totalPages]);

//     const allVisibleIds = paginatedUsers.map((b) => b._id);
//     const isAllSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));

//     const toggleSelect = (id) => {
//         setSelectedIds((prev) =>
//             prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//         );
//     };

//     const toggleSelectAll = () => {
//         if (isAllSelected) {
//             setSelectedIds((prev) => prev.filter((id) => !allVisibleIds.includes(id)));
//         } else {
//             setSelectedIds((prev) => Array.from(new Set([...prev, ...allVisibleIds])));
//         }
//     };

//     const handlePaginationChange = (e) => {
//         const value = Number(e.target.value);
//         setRowsPerPage(value);
//         setCurrentPage(1);
//     };

//     const handlePrevPage = () => {
//         setCurrentPage((prev) => Math.max(1, prev - 1));
//     };

//     const handleNextPage = () => {
//         setCurrentPage((prev) => Math.min(totalPages, prev + 1));
//     };

//     const startIndex = filteredUsers.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
//     const endIndex = Math.min(currentPage * rowsPerPage, filteredUsers.length);

//     return (
//         <div className="max-w-7xl mx-auto space-y-4">
//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
//                 <div>
//                     <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">User</h2>
//                     <p className="text-sm text-gray-500">Manage all school customers.</p>
//                 </div>

//                 <div className="flex gap-2 w-full sm:w-auto bg-white">
//                     <input
//                         type="search"
//                         value={search}
//                         onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
//                         placeholder="Search by title, author, category..."
//                         className="flex-1 sm:w-72 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <Link to={`/${import.meta.env.VITE_ADMIN}/add-user`} className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Add User</Link>
//                 </div>

//             </div>

//             <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
//                 {selectedIds.length > 0 && (
//                     <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
//                         <span>{selectedIds.length} book(s) selected</span>
//                         <button
//                             className="text-blue-600 hover:underline"
//                             onClick={() => setSelectedIds([])}
//                         >
//                             Clear selection
//                         </button>
//                     </div>
//                 )}

//                 <div className="overflow-x-auto">
//                     <UserTable render={render} setRender={setRender} isAllSelected={isAllSelected} toggleSelectAll={toggleSelectAll} paginatedUsers={paginatedUsers} selectedIds={selectedIds} toggleSelect={toggleSelect} />
//                 </div>

//                 <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
//                     <div className="flex items-center gap-2">
//                         <span>Rows per page:</span>
//                         <select
//                             value={rowsPerPage}
//                             onChange={handlePaginationChange}
//                             className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value={5}>5 rows</option>
//                             <option value={10}>10 rows</option>
//                             <option value={20}>20 rows</option>
//                             <option value={30}>30 rows</option>
//                         </select>
//                         <span className="hidden sm:inline">
//                             {filteredUsers.length > 0
//                                 ? `Showing ${startIndex}–${endIndex} of ${filteredUsers.length} books`
//                                 : "Showing 0 of 0 books"}
//                         </span>
//                     </div>

//                     <div className="flex items-center gap-3 justify-end">
//                         <button
//                             onClick={handlePrevPage}
//                             disabled={currentPage === 1}
//                             className={`px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
//                                 }`}
//                         >
//                             Prev
//                         </button>
//                         <span>
//                             Page{" "}
//                             <span className="font-semibold text-gray-700">
//                                 {Math.min(currentPage, totalPages)}
//                             </span>{" "}
//                             of{" "}
//                             <span className="font-semibold text-gray-700">
//                                 {totalPages}
//                             </span>
//                         </span>
//                         <button
//                             onClick={handleNextPage}
//                             disabled={currentPage >= totalPages}
//                             className={`px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 ${currentPage >= totalPages
//                                 ? "opacity-50 cursor-not-allowed"
//                                 : ""
//                                 }`}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default User



import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import UserTable from "../../components/admin/UserTable";
import { Link } from "react-router-dom";

function User() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [render, setRender] = useState(false);

    // ==============================
    // Fetch Users
    // ==============================
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${import.meta.env.VITE_API}/api/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const apiUsers = Array.isArray(response.data)
                    ? response.data
                    : response.data?.data || [];

                setUsers(apiUsers);
            } catch (error) {
                console.error(
                    "Error fetching users:",
                    error.response?.data || error.message
                );
            }
        };

        fetchUsers();
    }, [render]);

    // ==============================
    // Search + Remove Admin
    // ==============================
    const filteredUsers = useMemo(() => {
        const term = search.trim().toLowerCase();

        return users
            .filter((user) => user.role !== "admin")
            .filter((user) => {
                if (!term) return true;

                return (
                    user.username?.toLowerCase().includes(term) ||
                    user.email?.toLowerCase().includes(term) ||
                    user.first_name?.toLowerCase().includes(term) ||
                    user.last_name?.toLowerCase().includes(term)
                );
            });
    }, [users, search]);

    // ==============================
    // Pagination
    // ==============================
    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / rowsPerPage)
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedUsers = useMemo(() => {
        const start = (safePage - 1) * rowsPerPage;

        return filteredUsers.slice(
            start,
            start + rowsPerPage
        );
    }, [
        filteredUsers,
        safePage,
        rowsPerPage,
    ]);

    // ==============================
    // Selection
    // ==============================
    const allVisibleIds = paginatedUsers.map(
        (user) => user._id
    );

    const isAllSelected =
        allVisibleIds.length > 0 &&
        allVisibleIds.every((id) =>
            selectedIds.includes(id)
        );

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds((prev) =>
                prev.filter(
                    (id) => !allVisibleIds.includes(id)
                )
            );
        } else {
            setSelectedIds((prev) =>
                Array.from(
                    new Set([
                        ...prev,
                        ...allVisibleIds,
                    ])
                )
            );
        }
    };

    // ==============================
    // Rows Per Page
    // ==============================
    const handlePaginationChange = (e) => {
        const value = Number(e.target.value);

        setRowsPerPage(value);
        setCurrentPage(1);
    };

    // ==============================
    // Previous Page
    // ==============================
    const handlePrevPage = () => {
        setCurrentPage((prev) =>
            Math.max(1, prev - 1)
        );
    };

    // ==============================
    // Next Page
    // ==============================
    const handleNextPage = () => {
        setCurrentPage((prev) =>
            Math.min(totalPages, prev + 1)
        );
    };

    // ==============================
    // Search
    // ==============================
    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    // ==============================
    // Pagination Text
    // ==============================
    const startIndex =
        filteredUsers.length === 0
            ? 0
            : (safePage - 1) * rowsPerPage + 1;

    const endIndex = Math.min(
        safePage * rowsPerPage,
        filteredUsers.length
    );

    return (
        <div className="max-w-7xl mx-auto space-y-4">

            {/* ================= HEADER ================= */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">

                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Users
                    </h2>

                    <p className="text-sm text-gray-500">
                        Manage all school customers.
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto bg-white">

                    {/* Search */}
                    <input
                        type="search"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by username, email, or name..."
                        className="flex-1 sm:w-72 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Add User */}
                    <Link
                        to={`/${import.meta.env.VITE_ADMIN}/add-user`}
                        className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                    >
                        Add User
                    </Link>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">

                {/* Selection Bar */}
                {selectedIds.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">

                        <span>
                            {selectedIds.length} user(s) selected
                        </span>

                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setSelectedIds([])}
                        >
                            Clear selection
                        </button>
                    </div>
                )}

                {/* User Table */}
                <div className="overflow-x-auto">
                    <UserTable
                        render={render}
                        setRender={setRender}
                        isAllSelected={isAllSelected}
                        toggleSelectAll={toggleSelectAll}
                        paginatedUsers={paginatedUsers}
                        selectedIds={selectedIds}
                        toggleSelect={toggleSelect}
                    />
                </div>

                {/* ================= PAGINATION ================= */}
                <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">

                    {/* Left */}
                    <div className="flex items-center gap-2">

                        <span>
                            Rows per page:
                        </span>

                        <select
                            value={rowsPerPage}
                            onChange={handlePaginationChange}
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
                            {filteredUsers.length > 0
                                ? `Showing ${startIndex}–${endIndex} of ${filteredUsers.length} users`
                                : "Showing 0 of 0 users"}
                        </span>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3 justify-end">

                        {/* Previous */}
                        <button
                            onClick={handlePrevPage}
                            disabled={safePage === 1}
                            className={`px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 ${
                                safePage === 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            Prev
                        </button>

                        {/* Page Number */}
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
                            onClick={handleNextPage}
                            disabled={safePage >= totalPages}
                            className={`px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 ${
                                safePage >= totalPages
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

export default User;