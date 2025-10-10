// Suvarna
const { supabaseAdmin } = require("../config/database");
const { generateDeviceFingerprint } = require("../utils/helpers");

// Check if user is already logged in from another device
const checkDeviceSession = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const currentDeviceFingerprint = generateDeviceFingerprint(req);

    // Get active session
    const { data: activeSession, error } = await supabaseAdmin
      .from("user_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      throw error;
    }

    // If there's an active session from a different device, prevent access
    if (
      activeSession &&
      activeSession.device_fingerprint !== currentDeviceFingerprint
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are already logged in from another device. Please logout from that device first.",
      });
    }

    next();
  } catch (error) {
    console.error("Device validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Device validation failed",
    });
  }
};

module.exports = {
  checkDeviceSession,
};
