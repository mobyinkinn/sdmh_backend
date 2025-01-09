import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Blogs } from "../models/blogs.model.js";

const createBlogs = asyncHandler(async (req, res) => {
  const { title, smallDescription, description, date, status } =
    req.body;
  if (!title || !smallDescription || !description || !date) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const existingEvent = await Blogs.findOne({ smallDescription });
  if (existingEvent) {
    throw new ApiError(400, "Blog already exists");
  }

 const imageLocalPath = req.files?.image[0]?.path;
 if (!imageLocalPath) {
   throw new ApiError(400, "Image is required!!!");
 }

 const image = await uploadOnCloudinary(imageLocalPath);
 if (!image) {
   throw new ApiError(500, "Image failed to upload!!!");
 }

  const images = [];

  if (req.files?.images.length === 0) {
    throw new ApiError(400, "Images are requried");
  }

  for (let i = 0; i < req.files.images.length; i++) {
    const image = await uploadOnCloudinary(req.files.images[i].path);
    if (!image) {
      throw new ApiError(
        500,
        "Something went wrong while uploading the images"
      );
    }
    images.push(image.url);
  }

  if (images.length === 0) {
    throw new ApiError(500, "Something went wrong while uploading the images");
  }

  const event = await Blogs.create({
    title,
    smallDescription,
    description,
    date,
    status: status || true,
    images: images,
    image: image.url || undefined,
  });

  if (!event) {
    throw new ApiError(500, "Something went wrong while creating the event!!!");
  }

  res.status(200).json(new ApiResponse(200, "Blog created", event));
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blogs.find();
  if (!blogs || blogs.length === 0) {
    throw new ApiError(500, "Something went wrong while fetching the Blogs");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Blogs fetched successfully", blogs));
});

const updateBlog = asyncHandler(async (req, res) => {
  const { title, smallDescription, description, date, status } =
    req.body;

  if (
    !title &&
    !smallDescription &&
    !description &&
    !date &&
    !status
  ) {
    throw new ApiError(400, "All fields are empty");
  }

  const exists = await Blogs.findById(req.query.id);
  if (!exists) {
    throw new ApiError(400, "No event found");
  }

  const updatedEvent = await Blogs.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedEvent) {
    throw new ApiError(500, "Something went wrong while updating the blog!!!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Blog updated succesfully", updatedEvent));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const exists = await Blogs.findById(req.query.id);
  if (!exists) {
    throw new ApiError(400, "No event found");
  }

  const deletedEvent = await Blogs.findByIdAndDelete(req.query.id);

  if (!deletedEvent) {
    throw new ApiError(500, "Something went wrong while deleting the event");
  }

  res.status(200).json(new ApiResponse(200, "Event deleted successfully"));
});

// const deleteImage = asyncHandler(async (req, res) => {
//   const event = await Blogs.findById(req.query.id);
//   const { index } = req.body;

//   if (!event) {
//     throw new ApiError(400, "No event found!!!");
//   }

//   if (!index) {
//     throw new ApiError(400, "Index is required!!!");
//   }

//   const images = event.images;
//   if (images.length <= 1) {
//     throw new ApiError(400, "Images can not be 0, add more images to delete.");
//   }

//   images.splice(index, 1);
//   const updatedEvent = await Blogs.findByIdAndUpdate(
//     req.query.id,
//     { $set: { images } },
//     { new: true }
//   );

//   if (!updatedEvent) {
//     throw new ApiError(500, "Something went while updating the event!!!");
//   }

//   res.status(200).json(new ApiResponse(200, "Image deleted.", updatedEvent));
// });

// const addImages = asyncHandler(async (req, res) => {
//   const event = await Blogs.findById(req.query.id);
//   if (!event) {
//     throw new ApiError(400, "No event found!!!");
//   }

//   const existingImages = event.images.length;
//   const incomingImages = req.files.images.length;

//   if (existingImages + incomingImages > 6) {
//     throw new ApiError(
//       400,
//       `Only ${6 - existingImages} images can be added, remove the extra images`
//     );
//   }
//   if (incomingImages.length === 0) {
//     throw new ApiError(400, "Please add images.!!!");
//   }

//   const images = event.images;

//   for (let i = 0; i < incomingImages; i++) {
//     const image = await uploadOnCloudinary(req.files.images[i].path);
//     if (!image) {
//       throw new ApiError(
//         500,
//         "Something went wrong while uploading the images"
//       );
//     }
//     images.push(image.url);
//   }

//   const updatedEvent = await Blogs.findByIdAndUpdate(
//     req.query.id,
//     { $set: { images } },
//     { new: true }
//   );

//   res.status(200).json(new ApiResponse(200, "Images added.", updatedEvent));
// });
const blockBlog = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const blogs = await Blogs.findById(id);
  if (!blogs) {
    throw new ApiError(400, "blog not found!!!");
  }

  // Update the status to false (blocked)
  blogs.status = false;

  const updatedBlog = await blogs.save();
  if (!updatedBlog) {
    throw new ApiError(
      500,
      "Something went wrong while blocking the blogs!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "blog blocked successfully!!!", {
      blogs: updatedBlog,
    })
  );
});

// Unblock Testimonial function
const unblockBlog= asyncHandler(async (req, res) => {
  const { id } = req.query;

  const blogs = await Blogs.findById(id);
  if (!blogs) {
    throw new ApiError(400, "Blog not found!!!");
  }

  // Update the status to true (unblocked)
  blogs.status = true;

  const updatedBlog = await blogs.save();
  if (!updatedBlog) {
    throw new ApiError(
      500,
      "Something went wrong while unblocking the blog!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "blog unblocked successfully!!!", {
      blogs: updatedBlog,
    })
  );
});
const updateImage = asyncHandler(async (req, res) => {
  const blog = await Blogs.findById(req.query.id);
  if (!blog) {
    throw new ApiError(400, "No such blog exists!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(500, "Image failed to upload");
  }

  const updatedAward = await Blogs.findByIdAndUpdate(
    req.query.id,
    { image: image.url },
    { new: true }
  );

  if (!updatedAward) {
    throw new ApiError(
      500,
      "Something went wrong while updating the blogs!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog found", updatedAward));
});

const addImages = asyncHandler(async (req, res) => {
  const blog = await Blogs.findById(req.query.id);
  if (!blog) {
    throw new ApiError(400, "No event found!!!");
  }

  const existingImages = blog.images.length;
  const incomingImages = req.files.images.length;

  if (existingImages + incomingImages > 6) {
    throw new ApiError(
      400,
      `Only ${6 - existingImages} images can be added, remove the extra images`
    );
  }
  if (incomingImages.length === 0) {
    throw new ApiError(400, "Please add images.!!!");
  }

  const images = blog.images;

  for (let i = 0; i < incomingImages; i++) {
    const image = await uploadOnCloudinary(req.files.images[i].path);
    if (!image) {
      throw new ApiError(
        500,
        "Something went wrong while uploading the images"
      );
    }
    images.push(image.url);
  }

  const updatedEvent = await Blogs.findByIdAndUpdate(
    req.query.id,
    { $set: { images } },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, "Images added.", updatedEvent));
});
const updateImages = asyncHandler(async (req, res) => {
  const blog = await Blogs.findById(req.query.id);
  if (!blog) {
    throw new ApiError(400, "No such blog exists!!!");
  }
 const images = [];

 if (req.files?.images.length === 0) {
   throw new ApiError(400, "Images are requried");
 }

 for (let i = 0; i < req.files.images.length; i++) {
   const image = await uploadOnCloudinary(req.files.images[i].path);
   if (!image) {
     throw new ApiError(500, "Something went wrong while uploading the images");
   }
   images.push(image.url);
 }

  if (images.length === 0) {
    throw new ApiError(500, "Something went wrong while uploading the images");
  }

  const updatedAward = await Blogs.findByIdAndUpdate(
    req.query.id,
    { images: images },
    { new: true }
  );

  if (!updatedAward) {
    throw new ApiError(500, "Something went wrong while updating the blogs!!!");
  }

  return res.status(200).json(new ApiResponse(200, "Blog found", updatedAward));
});

const getBannerById = asyncHandler(async (req, res) => {
  const { _id } = req.query;

  if (!_id) {
    throw new ApiError(400, "Blog is required!!!");
  }

  const blog = await Blogs.findOne({ _id });
  if (!blog) {
    throw new ApiError(400, "No Blog found");
  }

  res.status(200).json(new ApiResponse(200, "Blog by id!!!", blog));
});
export {
  createBlogs,
  updateImage,
  getAllBlogs,
  deleteBlog,
  unblockBlog,
  blockBlog,
  updateBlog,
  updateImages,
  getBannerById,
  //   updateEvent,
  //   deleteEvent,
  //   getAllBlogs,
  //   deleteImage,
    addImages,
};
