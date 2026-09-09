import express from "express";
import authMiddleware from "../middlewares/authentication.js";
import { createAddress, getAddressById, getAddressByUserId, updateAddress,deleteAddress, getAddresses } from "../controllers/address.controller.js";
import { authorize, selfOrAdmin } from "../middlewares/authorize.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(authorize("admin"), getAddresses).post(createAddress);
router.get("/user/:id", selfOrAdmin("id"), getAddressByUserId);

router.route("/:id")
    .get(getAddressById)
    .patch(updateAddress)
    .delete(deleteAddress);

export default router;