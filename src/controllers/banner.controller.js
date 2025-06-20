import { Banner } from "../models/banner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnLocalServer } from "../utils/cloudinary.js";

const createBanner = asyncHandler(async (req, res) => {
  const { page, status, link } = req.body;
  console.log("Req Body:", req.body);

  if (!page) {
    throw new ApiError(400, "Page is required!!!");
  }

  const existingBanner = await Banner.findOne({ page });
  if (existingBanner) {
    throw new ApiError(400, "Banner for this page already exists!!!");
  }



   const images = [];
   if (!req.files?.images || req.files.images.length === 0) {
     throw new ApiError(400, "Images are required");
   }

   for (let i = 0; i < req.files.images.length; i++) {
     const image = await uploadOnLocalServer(
       req.files.images[i].path,
       req.files.images[i]?.originalname
     );
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


   const mobileimages = [];
   if (!req.files?.mobileimages || req.files.mobileimages.length === 0) {
     throw new ApiError(400, "Images are required");
   }

   for (let i = 0; i < req.files.mobileimages.length; i++) {
     const image = await uploadOnLocalServer(
       req.files.mobileimages[i].path,
       req.files.mobileimages[i]?.originalname
     );
     if (!image) {
       throw new ApiError(
         500,
         "Something went wrong while uploading the images"
       );
     }
     mobileimages.push(image.url);
   }

   if (mobileimages.length === 0) {
     throw new ApiError(500, "Something went wrong while uploading the images");
   }

  const banner = await Banner.create({
    page,
    images: images,
    mobileimages: mobileimages,
    link,
    status,
  });

  if (!banner) {
    throw new ApiError(
      500,
      "Something went wrong while creating the banner!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Banner created successfully!!!", banner));
});




// const createBanner = asyncHandler(async (req, res) => {
//   const { page, status, link } = req.body;
//   console.log("Req Body:", req.body); // Check the incoming request body

//   if (!page) {
//     throw new ApiError(400, "Page is required!!!");
//   }

//   const existingBanner = await Banner.findOne({ page });
//   if (existingBanner) {
//     throw new ApiError(400, "Banner for this page already exists!!!");
//   }

//   // Check if banner and mobileBanner are provided in the request
//   const imageLocalPath = req.files?.banner ? req.files.banner[0]?.path : null;
//   const mobileimageLocalPath = req.files?.mobileBanner
//     ? req.files.mobileBanner[0]?.path
//     : null;

//   if (!imageLocalPath) {
//     throw new ApiError(400, "Logo (banner image) is required");
//   }
//   if (!mobileimageLocalPath) {
//     throw new ApiError(400, "Mobile banner image is required");
//   }

//   const banners = await uploadOnLocalServer(
//     imageLocalPath,
//     req.files?.banner[0]?.originalname
//   );
//   if (!banners) throw new ApiError(500, "Failed to upload banner image");

//   const mobilebanners = await uploadOnLocalServer(
//     mobileimageLocalPath,
//     req.files?.mobileBanner[0]?.originalname
//   );
//   if (!mobilebanners)
//     throw new ApiError(500, "Failed to upload mobile banner image");

//   // Initialize arrays to store image URLs
//   const images = [];
//   if (req.files?.images && req.files.images.length > 0) {
//     // Process each image for desktop banner
//     for (let i = 0; i < req.files.images.length; i++) {
//       const fileLocalPath = req.files.images[i].path;
//       const image = await uploadOnLocalServer(
//         fileLocalPath,
//         req.files.images[i].originalname
//       );
//       if (image) {
//         images.push(image.url); // Use the URL from the function's return
//       }
//     }
//   }

//   const mobileimages = [];
//   if (req.files?.mobileimages && req.files.mobileimages.length > 0) {
//     // Process each image for mobile banner
//     for (let i = 0; i < req.files.mobileimages.length; i++) {
//       const fileLocalPath = req.files.mobileimages[i].path;
//       const image = await uploadOnLocalServer(
//         fileLocalPath,
//         req.files.mobileimages[i].originalname
//       );
//       if (image) {
//         mobileimages.push(image.url);
//       }
//     }
//   }

//   // Create the banner document in MongoDB
//   const banner = await Banner.create({
//     page,
//     images: images,
//     mobileimages: mobileimages,
//     link,
//     mobilebanners: mobilebanners.url,
//     banners:banners.url,
//     status,
//   });

//   if (!banner) {
//     throw new ApiError(
//       500,
//       "Something went wrong while creating the banner!!!"
//     );
//   }

//   res
//     .status(200)
//     .json(new ApiResponse(200, "Banner created successfully!!!", banner));
// });


const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find();
  if (!banners) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the banners!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Banners fetched successfully!!!", banners));
});

const getBannerByPage = asyncHandler(async (req, res) => {
  const { page } = req.query;

  if (!page) {
    throw new ApiError(400, "Page is required!!!");
  }

  const banner = await Banner.findOne({ page });
  if (!banner) {
    throw new ApiError(400, "No banner found");
  }

  res.status(200).json(new ApiResponse(200, "Banner sent!!!", banner));
});

const updateBanner = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const { link } = req.body;

  if (!page) {
    throw new ApiError(400, "Page is required!!!");
  }

  const banner = await Banner.findOne({ page });
  if (!banner) {
    throw new ApiError(404, "No banner found for this page!!!");
  }

  const updateFields = {};

  if (req.files?.images) {
    const localBannerPath = req.files.images[0]?.path;
    if (localBannerPath) {
      const bannerUrl = await uploadOnLocalServer(localBannerPath);
      if (!bannerUrl) {
        throw new ApiError(
          500,
          "Something went wrong while uploading the banner!!!"
        );
      }
      updateFields.images = bannerUrl.url;
    }
  }

  if (req.files?.mobileimages) {
    const localMobileBannerPath = req.files.mobileimages[0]?.path;
    if (localMobileBannerPath) {
      const mobileBannerUrl = await uploadOnLocalServer(localMobileBannerPath);
      if (!mobileBannerUrl) {
        throw new ApiError(
          500,
          "Something went wrong while uploading the mobile banner!!!"
        );
      }
      updateFields.mobileimages = mobileBannerUrl.url;
    }
  }

  if (link) {
    updateFields.link = link;
  }

  const updatedBanner = await Banner.findByIdAndUpdate(
    banner._id,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedBanner) {
    throw new ApiError(
      500,
      "Something went wrong while updating the banner!!!"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Banner updated successfully!!!", updatedBanner)
    );
});

const deleteBanner = asyncHandler(async (req, res) => {
  const { page } = req.query;

  if (!page) {
    throw new ApiError(400, "Page is required!!!");
  }

  const banner = await Banner.findOne({ page });
  if (!banner) {
    throw new ApiError(400, "No banner found");
  }

  const deletedBanner = await Banner.findByIdAndDelete(banner._id);
  if (!deletedBanner) {
    throw new ApiError(
      500,
      "Something went wrong while deleting the banner!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Banner deleted successfully!!!"));
});

const blockBanner = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError(400, "Banner not found!!!");
  }

  // Update the status to false (blocked)
  banner.status = false;

  const updatedBanner = await banner.save();
  if (!updatedBanner) {
    throw new ApiError(
      500,
      "Something went wrong while blocking the Banner!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "Banner blocked successfully!!!", {
      Banner: updatedBanner,
    })
  );
});

// Unblock Banner function
const unblockBanner = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError(400, "Banner not found!!!");
  }

  // Update the status to true (unblocked)
  banner.status = true;

  const updatedBanner = await banner.save();
  if (!updatedBanner) {
    throw new ApiError(
      500,
      "Something went wrong while unblocking the Banner!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "Banner unblocked successfully!!!", {
      Banner: updatedBanner,
    })
  );
});
export {
  createBanner,
  getAllBanners,
  getBannerByPage,
  updateBanner,
  deleteBanner,
  blockBanner,
  unblockBanner,
};
