import User from "../models/user.model";

// Create or update user based on Google ID
const postUser = async (profile) => {
  try {
    // Default values in case profile.name is undefined or missing properties
    const name = profile.name || {};
    const familyName = name.familyName || "";
    const givenName = name.givenName || "";

    // Ensure profile.photos is an array, or default to an empty array
    const photos = Array.isArray(profile.photos)
      ? profile.photos.map((photo) => photo.value)
      : [];

    const user = await User.findOneAndUpdate(
      { googleId: profile.id },
      {
        displayName: profile.displayName || "",
        name: {
          familyName: familyName,
          givenName: givenName,
        },
        photos: photos,
        provider: profile.provider || "",
      },
      { new: true, upsert: true } // Create new document if not found, return the new document
    );
    return user;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
const getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw error;
  }
};

export default {
  postUser,
  getUserById,
};
