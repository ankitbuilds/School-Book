import axios from "axios";

const API = import.meta.env.VITE_API;

const normalizeOrder = (order) => ({
    ...order,
    user: order.userId || null,

    items: (order.items || []).map((item) => ({
        ...item,
        book: item.bookId || null,
    })),
});

const getOrder = async ({ request } = {}) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(`${API}/api/order`, {
            signal: request?.signal,

            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Your backend returns:
        // { data, total, page, pages }

        const orders = Array.isArray(data)
            ? data
            : data?.data || [];

        return orders.map(normalizeOrder);

    } catch (error) {
        if (axios.isCancel(error)) {
            return [];
        }

        console.error(
            "Failed to fetch orders:",
            error.response?.data || error.message
        );

        return [];
    }
};

const getOrderById = async ({ params, request } = {}) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
            `${API}/api/order/${params.id}`,
            {
                signal: request?.signal,

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return normalizeOrder(data);

    } catch (error) {
        if (axios.isCancel(error)) {
            return null;
        }

        console.error(
            "Failed to fetch order by ID:",
            error.response?.data || error.message
        );

        throw new Response("Order not found", {
            status: error.response?.status || 500,
        });
    }
};

export { getOrder, getOrderById };