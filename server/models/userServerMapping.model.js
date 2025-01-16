import mongoose from "mongoose";

const userServerMappingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    serverId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserServerMapping = mongoose.model(
  "UserServerMapping",
  userServerMappingSchema
);

export default UserServerMapping;
