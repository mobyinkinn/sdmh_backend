// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { Donation } from "../models/donation.model.js";

// const createDonation = asyncHandler(async (req, res) => {
//   const {
//     donationType,
//     amount,
//     fname,
//     lname,
//     mobile,
//     email,
//     state,
//     city,
//     address,
//     zip,
//   } = req.body;

//   if (!donationType || !amount || !fname || !lname || !mobile || !email) {
//     throw new ApiError(400, "Missing required donation fields!");
//   }

//   const txnId = "TXN" + Date.now();

//   // Save donation to DB
//   const newDonation = await Donation.create({
//     donationType,
//     amount,
//     fname,
//     lname,
//     mobile,
//     email,
//     state,
//     city,
//     address,
//     zip,
//     txnId,
//   });

//   // Construct payment form
//   const returnUrl = "http://localhost:8000/api/atom-response"; // update for production
//   const clientCode = Buffer.from(`${fname} ${lname}`).toString("base64");

//   const atomForm = `
//     <form id="atomForm" method="post" action="https://caller.atomtech.in/ots/aipay/auth">
//       <input type="hidden" name="login" value="446442" />
//       <input type="hidden" name="pass" value="Test@123" />
//       <input type="hidden" name="ttype" value="NBFundTransfer" />
//       <input type="hidden" name="prodid" value="NSE" />
//       <input type="hidden" name="amt" value="${amount}" />
//       <input type="hidden" name="txncurr" value="INR" />
//       <input type="hidden" name="txnscamt" value="0" />
//       <input type="hidden" name="clientcode" value="${clientCode}" />
//       <input type="hidden" name="txnid" value="${txnId}" />
//       <input type="hidden" name="date" value="${new Date().toISOString().slice(0, 10)}" />
//       <input type="hidden" name="custacc" value="639827" />
//       <input type="hidden" name="ru" value="${returnUrl}" />
//     </form>
//     <script>document.getElementById("atomForm").submit();</script>
//   `;

//   res.status(200).send(atomForm);
// });



// export { createDonation };












import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Donation } from "../models/donation.model.js";

const createDonation = asyncHandler(async (req, res) => {
  const {
    donationType,
    amount,
    fname,
    lname,
    mobile,
    email,
    state,
    city,
    address,
    zip,
  } = req.body;

  if (!donationType || !amount || !fname || !lname || !mobile || !email) {
    throw new ApiError(400, "Missing required donation fields!");
  }

  const txnId = "TXN" + Date.now();
  const newDonation = await Donation.create({
    donationType,
    amount,
    fname,
    lname,
    mobile,
    email,
    state,
    city,
    address,
    zip,
    txnId,
  });

  // const clientCode = Buffer.from(`${fname} ${lname}`).toString("base64");
  // const returnUrl =
  //   process.env.ATOM_RETURN_URL || "http://localhost:8000/api/atom-response";

  // const atomForm = `
  //   <form id="atomForm" method="post" action="https://caller.atomtech.in/ots/aipay/auth">
  //     <input type="hidden" name="login" value="${process.env.ATOM_LOGIN}" />
  //     <input type="hidden" name="pass" value="${process.env.ATOM_PASS}" />
  //     <input type="hidden" name="ttype" value="NBFundTransfer" />
  //     <input type="hidden" name="prodid" value="NSE" />
  //     <input type="hidden" name="amt" value="${amount}" />
  //     <input type="hidden" name="txncurr" value="INR" />
  //     <input type="hidden" name="txnscamt" value="0" />
  //     <input type="hidden" name="clientcode" value="${clientCode}" />
  //     <input type="hidden" name="txnid" value="${txnId}" />
  //     <input type="hidden" name="date" value="${new Date().toISOString().slice(0, 10)}" />
  //     <input type="hidden" name="custacc" value="639827" />
  //     <input type="hidden" name="ru" value="${returnUrl}" />
  //   </form>
  //   <script>document.getElementById("atomForm").submit();</script>
  // `;
  const clientcode = Buffer.from(fname).toString("base64");
  const today = new Date();
  const returnUrl =
    process.env.ATOM_RETURN_URL || "http://localhost:8000/api/atom-response";
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${today.getFullYear()}`;

 const atomForm = `
  <form id="atomForm" method="post" action="https://caller.atomtech.in/ots/aipay/auth">
    <input type="hidden" name="login" value="${process.env.ATOM_LOGIN}" />
    <input type="hidden" name="pass" value="${process.env.ATOM_PASS}" />
    <input type="hidden" name="ttype" value="NBFundTransfer" />
    <input type="hidden" name="prodid" value="NSE" />
    <input type="hidden" name="amt" value="${parseFloat(amount).toFixed(2)}" />
    <input type="hidden" name="txncurr" value="INR" />
    <input type="hidden" name="txnscamt" value="0" />
    <input type="hidden" name="clientcode" value="${clientcode}" />
    <input type="hidden" name="txnid" value="${txnId}" />
    <input type="hidden" name="date" value="${formattedDate}" />
    <input type="hidden" name="custacc" value="639827" />
    <input type="hidden" name="ru" value="${returnUrl}" />
  </form>
  <script>document.getElementById("atomForm").submit();</script>
`;

console.log({
  login: process.env.ATOM_LOGIN,
  pass: process.env.ATOM_PASS,
  amt: parseFloat(amount).toFixed(2),
  txnid: txnId,
  clientcode,
  date: formattedDate,
  ru: returnUrl,
});

  res.status(200).send(atomForm);
});

export { createDonation };
