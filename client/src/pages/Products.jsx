import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import Message from "../components/Message";
import ProductsComponent from "../components/ProductsComponent";
import { contextStore } from "../context/ContextStore";
import { productReducer } from "../reducers/productReducer";
import { useStateReducer } from "../reducers/reducerFunctions";
const { VITE_BACKEND_URL } = import.meta.env;

// All products page
function Products() {
    const store = useContext(contextStore);
    const [products, productsDispatch] = useReducer(productReducer, []);
    const [error, errorDispatch] = useReducer(useStateReducer, "")
    const { userId, userType } = store.userStore.userData;
    async function getProducts() {
        try {
            const response = await axios.get(`${VITE_BACKEND_URL}/getitems/${userType}/${userId}/null`);
            if (response.status === 201) {
                if (response.data.products.length) {
                    productsDispatch({ type: "LOAD_PRODUCTS", payload: response.data.products })
                }
                else {
                    errorDispatch("No products found.")
                }
            }
        }
        catch (error) {
            if (Object.values(error.response.data)[0]) {
                errorDispatch(Object.values(error.response.data)[0]);
            }
            else if (error.response.statusText) {
                errorDispatch(error.response.statusText);
            }
        }
    }

    useEffect(
        () => {
            if (!products.length) {
                getProducts();
            }
        }, []
    )

    return (
        <>
            {
                error
                    ?
                    <Message text={error} icon={faCircleExclamation} color="#0dcaf0" size="8x" />
                    :
                    products.length
                        ?
                        < ProductsComponent {...{ products, errorDispatch, userType }} />
                        :
                        <Loading variant="info" loadingMessage="Loading..." containerClassName="h-100 d-flex align-items-center justify-content-center gap-3" />
            }
        </>
    )

}

export default Products;