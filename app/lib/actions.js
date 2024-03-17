"use server";
import { revalidatePath } from "next/cache";
import { Product, User } from "./models";
import { connectTodb } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";

export const addUser = async (formData) => {
  const { username, email, password, phone, isAdmin, isActive } =
    Object.fromEntries(formData);

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  try {
    connectTodb();
    const newUser = new User({
      username,
      email,
      password: hashed,
      phone,
      isAdmin,
      isActive,
    });
    await newUser.save();
  } catch (error) {
    console.log(error);
    throw new Error("failed to create user");
  }

  revalidatePath("/dashboard/users"); //to refresh table.
  redirect("/dashboard/users");
};

export const updateUser = async (formData) => {
  const { id, username, email, password, phone, isAdmin, isActive } =
    Object.fromEntries(formData);
  try {
    connectTodb();
    const updateFields = {
      username,
      email,
      password,
      phone,
      isAdmin,
      isActive,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );
    await User.findByIdAndUpdate(id, updateFields);
  } catch (error) {
    console.log(error);
    throw new Error("failed to update user");
  }

  revalidatePath("/dashboard/users"); //to refresh table.
  redirect("/dashboard/users");
};

export const addProduct = async (formData) => {
  const { title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    connectTodb();
    const newProduct = new Product({
      title,
      desc,
      price,
      stock,
      color,
      size,
    });
    await newProduct.save();
  } catch (error) {
    console.log(error);
    throw new Error("failed to add product");
  }

  revalidatePath("/dashboard/products"); //to refresh table.
  redirect("/dashboard/products");
};

export const updateProduct = async (formData) => {
  const { id, title, desc, price, stock, color, size } =
    Object.fromEntries(formData);
  try {
    connectTodb();
    const updateFields = { id, title, desc, price, stock, color, size };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );
    await Product.findByIdAndUpdate(id, updateFields);
  } catch (error) {
    console.log(error);
    throw new Error("failed to update product");
  }

  revalidatePath("/dashboard/products"); //to refresh table without another query.
  redirect("/dashboard/products");
};

export const deleteUser = async (formData) => {
  const { userId } = Object.fromEntries(formData);
  try {
    connectTodb();
    await User.findByIdAndDelete(userId);
  } catch (error) {
    console.log(error);
    throw new Error("failed to delete product");
  }

  revalidatePath("/dashboard/users"); //to refresh table.
};

export const deleteProduct = async (formData) => {
  const { productId } = Object.fromEntries(formData);

  try {
    connectTodb();
    await Product.findByIdAndDelete(productId);
  } catch (error) {
    console.log(error);
    throw new Error("failed to delete product");
  }

  revalidatePath("/dashboard/products"); //to refresh table.
};

export const authenticate = async (prevState, formData) => {
  const { username, password } = Object.fromEntries(formData);
  console.log(username);
  try {
    await signIn("credentials", { username, password });
  } catch (err) {
    if (err.message.includes("CredentialsSignin")) {
      return "Wrong Credentials";
    }
    throw err;
  }
};
