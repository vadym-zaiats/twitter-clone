import Validator from "fastest-validator";

export const validateService = new Validator();

export const postSchema = {
  title: { type: "string", min: 1, max: 50 },
  text: { type: "string", min: 1, max: 256 },
  genre: { type: "string", enum: ["Politic", "Business", "Sport", "Other"] },
  isPrivate: { type: "boolean" },
};

export const checkPostService = validateService.compile(postSchema);

// console.log(
//   "First:",
//   checkPostService({ title: "lll", text: "hhh", genre: "Politic", isPrivate: true })
// );
// Returns: true

// console.log(
//   "Second:",
//   checkPostService({ title: "lll", text: "hhh", genre: "kkk", isPrivate: true })
// );
// Returns an array with errors:
//    [
//   {
//     type: 'stringEnum',
//     message: "The 'genre' field does not match any of the allowed values.",
//     field: 'genre',
//     expected: 'Politic, Business, Sport, Other',
//     actual: 'kkk'
//   }
// ]
