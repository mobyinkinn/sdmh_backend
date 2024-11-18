import { Contact } from "../models/contact.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createContact = asyncHandler(async (req, res) => {
  const { name, phone, message, date, email } = req.body;

  if (!name || !phone || !message || !date || !email) {
    throw new ApiError(400, "Plese fill the required fields!!!");
  }

  const contact = await Contact.create(req.body);

  if (!contact) {
    throw new ApiError(500, "Something went wrong while creating the contact");
  }

  res.status(200).json(new ApiResponse(200, "Contact created!!!", contact));
});

const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();

  if (!contacts) {
    throw new ApiError(500, "Something went wrong!!!");
  }

  res.status(200).json(new ApiResponse(200, "Contacts found!!!", contacts));
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.query.id);
  if (!contact) {
    throw new ApiError(400, "No contact found!!!");
  }

  const deletedContact = await Contact.findByIdAndDelete(req.query.id);
  if (!deletedContact) {
    throw new ApiError(
      400,
      "Something went wrong while deleting the contact!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Contact deleted!!!"));
});

export { createContact, getAllContacts, deleteContact };
