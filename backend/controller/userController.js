// controller/userController.js
import Settings from '../models/Settings.js';

export const updateUserProfile = async (req, res) => {
  const userId = req.user.userId;
  const { reVerificationInterval } = req.body;

  try {
    let settings = await Settings.findOne({ userId });
    if (!settings) {
      settings = new Settings({ userId });
    }

    if (reVerificationInterval) {
      settings.reVerificationInterval = reVerificationInterval;
    }

    await settings.save();
    res.status(200).json({ message: 'Profile updated successfully', settings });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const settings = await Settings.findOne({ userId });
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    res.status(200).json({ settings });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};