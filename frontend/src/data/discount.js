import axios from "axios";

const getDiscount = async () => {
    try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${import.meta.env.VITE_API}/api/discount`,
            {
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return data ?? [];
    } catch (error) {
        console.error("Failed to fetch discounts:", error);
        return [];
    }
};

const getDiscountById = async ({ params }) => {
    try {
        const token = localStorage.geItem("token")
        const { data } = await axios.get(`${import.meta.env.VITE_API}/api/discount/${params.id}`,
            {
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return data ?? {};
    } catch (error) {
        console.error("Failed to fetch discounts:", error);
        return {};
    }
};

export { getDiscount, getDiscountById };
