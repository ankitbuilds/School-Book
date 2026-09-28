import axios from "axios";

const API = import.meta.env.VITE_API;
const token = localStorage.getItem("token");

export const getCart = async () => {
    const { data } = await axios.get(`${API}/api/cart`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return data;
};

export const getCartById = async ({ params }) => {
    const { data } = await axios.get(`${API}/api/cart/${params.id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return data;
};


// export const remove = async (id) => {
//     const token = localStorage.getItem("token"); 
    
//     const response = await axios.delete(`${API}/api/cart/${id}`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         }
//     });
//     return response.data;
// };

export const remove = async (id) => {
    
    // Add these lines to debug:
    console.log("--- DEBUGGING 401 ERROR ---");
    console.log("Token value:", token);
    console.log("Sending to URL:", `${API}/api/cart/${id}`);

    const response = await axios.delete(`${API}/api/cart/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
};
