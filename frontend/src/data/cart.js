import axios from "axios";

const API = import.meta.env.VITE_API;

export const getCart = async () => {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(`${API}/api/cart`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const getCartById = async ({ params }) => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API}/api/cart/${params.id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};