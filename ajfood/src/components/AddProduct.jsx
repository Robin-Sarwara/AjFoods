import React, { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastMessage";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import axiosInstance from "../utils/axiosInstance";

const AddProduct = () => {
  const [formdata, setFormdata] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    tags: "",
    isVeg: "true",
    ingredients: "",
    discount: "",
    preparationTime: "",
    availability: "true",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonChange, setButtonChange] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const productId = location.state?.productId;

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const update = async () => {
      try {
        if (productId) {
            setButtonChange(true);
          const response = await axiosInstance.get(
            `/products/${productId}`
          );
          setFormdata(response.data);
          if (response.data.imageUrls && response.data.imageUrls.length > 0) {
            setPreviewImages(response.data.imageUrls);
          }
        }
      } catch (error) {
            showErrorToast(
                error.response.data.message || "Error fetching your product data"
              );
      }
    };
    update();
  }, [productId]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length <= 3) {
      setFormdata({ ...formdata, images: files });

      previewImages.forEach((url) => URL.revokeObjectURL(url));

      const imagePreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(imagePreviews);
    } else {
      showErrorToast("Cannot select more than 3 images");
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    const productData = new FormData();
    productData.append("name", formdata.name);
    productData.append("description", formdata.description);
    productData.append("price", formdata.price);
    productData.append("category", formdata.category);
    productData.append("tags", formdata.tags);
    productData.append("isVeg", formdata.isVeg);
    productData.append("ingredients", formdata.ingredients);
    productData.append("discount", formdata.discount);
    productData.append("preparationTime", formdata.preparationTime);
    productData.append("availability", formdata.availability);

    if (formdata.images && formdata.images.length > 0) {
        formdata.images.forEach((image) => {
          productData.append("images", image);
        });
      }

    if (productId) {
      const response = await axiosInstance.put(
        `/products/${productId}`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showSuccessToast(
        response.data.message || "Product is updated successfully"
      );
      setFormdata({
        name: "",
        description: "",
        price: "",
        category: "",
        tags: "",
        isVeg: "true",
        ingredients: "",
        discount: "",
        preparationTime: "",
        availability: "true",
        images: [],
      });
      setPreviewImages([]);
      setButtonChange(false)
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } else {
        setButtonChange(false)
        console.log("api calling...");

        const response = await axiosInstance.post(
          "/products",
          productData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        showSuccessToast(
          response.data.message || "New product is added successfully!"
        );
        setFormdata({
          name: "",
          description: "",
          price: "",
          category: "",
          tags: "",
          isVeg: "true",
          ingredients: "",
          discount: "",
          preparationTime: "",
          availability: "true",
          images: [],
        });
        setPreviewImages([]);
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
    }
    catch (error) {
        showErrorToast(error.response.data.message   || "Error uploading product");
      } finally {
        setLoading(false);
      }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="w-full h-auto flex flex-col items-center justify-center bg-gray-200">
        <h1 className="font-serif mt-7 text-3xl">Add Product</h1>
        <form
          className="w-[80%] p-4 mt-5 h-auto flex flex-col justify-center items-center shadow-lg rounded-lg bg-white "
          onSubmit={handleSubmit}
        >
          <label className="font-semibold text-left w-[60%]" htmlFor="name">
            Product name
          </label>
          <input
            className="w-[60%] rounded-md m-2 p-2 outline-none border-2 border-gray-400"
            type="text"
            placeholder="Enter Product name"
            name="name"
            onChange={handleChange}
            value={formdata.name}
            required
          />
          <label
            className="font-semibold text-left w-[60%]"
            htmlFor="description"
          >
            Product description
          </label>
          <textarea
            className="w-[60%] rounded-md m-2 p-2 outline-none border-2 border-gray-400"
            placeholder="Enter Product description"
            name="description"
            onChange={handleChange}
            value={formdata.description}
            required
          ></textarea>
          <label className="font-semibold text-left w-[60%]" htmlFor="price">
            Product Price
          </label>
          <input
            className="w-[60%] rounded-md m-2 p-2 outline-none border-2 border-gray-400"
            type="number"
            placeholder="Enter Product price"
            name="price"
            onChange={handleChange}
            value={formdata.price}
            required
          />

          <label className="font-semibold text-left w-[60%]" htmlFor="category">
            Category
          </label>
          <input
            className="w-[60%] rounded-md m-2 p-2 outline-none border-2 border-gray-400"
            type="text"
            placeholder="Enter Product category"
            name="category"
            onChange={handleChange}
            value={formdata.category}
            required
          />

          <label className="font-semibold text-left w-[60%]" htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input
            className="w-[60%] rounded-md m-2 p-2 outline-none border-2 border-gray-400"
            type="text"
            placeholder="Enter Product tags"
            name="tags"
            onChange={handleChange}
            value={formdata.tags}
            required
          />

          <label
            className="font-semibold text-left w-[60%]"
            htmlFor="ingredients"
          >
            Ingredients (comma-separated)
          </label>
          <input
            className="w-[60%] rounded-md m-2 p-2 outline-none border-2 border-gray-400"
            type="text"
            placeholder="Enter Product Ingredients"
            name="ingredients"
            onChange={handleChange}
            value={formdata.ingredients}
            required
          />

          <label className="font-semibold text-left w-[60%]" htmlFor="discount">
            Discount (%)
          </label>
          <input
            className="w-[60%] rounded-md m-2 p-2 outline-none border-2 border-gray-400"
            type="text"
            placeholder="Enter any discount"
            name="discount"
            onChange={handleChange}
            value={formdata.discount}
            required
          />

          <label
            className="font-semibold text-left w-[60%]"
            htmlFor="preparationTime"
          >
            Preparation Time (in minutes)
          </label>
          <input
            className="w-[60%] rounded-md m-2 p-2 outline-none border-2 border-gray-400"
            type="text"
            placeholder="Enter product preparation time"
            name="preparationTime"
            onChange={handleChange}
            value={formdata.preparationTime}
            required
          />

          <label
            className="font-semibold text-left w-[60%]"
            htmlFor="availability"
          >
            Availability
          </label>
          <select
            className="w-[60%] rounded-md m-2 p-2 outline-none border-2 border-gray-400"
            name="availability"
            onChange={handleChange}
            value={formdata.availability}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <label className="font-semibold text-left w-[60%]" htmlFor="isVeg">
            Is Vegetarian?
          </label>
          <select
            className="w-[60%] rounded-md m-2 p-2 outline-none border-2 border-gray-400"
            name="isVeg"
            onChange={handleChange}
            value={formdata.isVeg}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <label className="font-semibold text-left w-[60%]" htmlFor="file">
            Add Product images
          </label>
          <input
            className="w-[60%] rounded-md text-left items-start m-2 p-2 outline-none border-2 border-gray-400"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            required={!productId}
          />

          {previewImages.length > 0 && (
            <div className="w-auto h- grid grid-cols-3 gap-4 m-2 border-2 border-blue-950 p-4 ">
              {previewImages.map((img, i) => (
                <img src={img} key={i} alt="preview" width="300" />
              ))}
            </div>
          )}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out active:scale-95">
            {buttonChange ? "Update" : "Add Product"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
