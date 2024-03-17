import { Product, User } from "./models";
import { connectTodb } from "./utils";

export const fetchUsers = async (q, page) => {
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 2;
  console.log("page", page);
  console.log("q", q);
  try {
    connectTodb();
    const count = await User.find({
      username: { $regex: regex },
    }).count();
    const users = await User.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    console.log("users", users);
    console.log("count", count);
    return { count, users };
  } catch (error) {
    console.log(error);
  }
};

export const fetchUser = async (id) => {
  try {
    connectTodb();
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("failed to fetch user");
  }
};

export const fetchProducts = async (q, page) => {
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 2;
  console.log("page", page);
  console.log("q", q);
  try {
    connectTodb();
    const count = await Product.find({
      title: { $regex: regex },
    }).count();
    const products = await Product.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    console.log("products", products);
    console.log("count", count);
    return { count, products };
  } catch (error) {
    console.log(error);
  }
};

export const fetchProduct = async (id) => {
  try {
    connectTodb();
    const product = await Product.findById(id);
    return product;
  } catch (error) {
    console.log(error);
    throw new Error("failed to fetch product");
  }
};
