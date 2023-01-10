const mongoose = require("mongoose");

mongoose.model("Order", {
  customerId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  bookId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  bookedDate: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
});
