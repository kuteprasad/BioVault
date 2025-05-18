import { getExtensionToken } from "../context/AuthContext";
import axios from 'axios';

export const matchBiometricData = async (formData: FormData) => {
    try {
      // console.log("formData in match bio data: ", formData);
      const token = await getExtensionToken();
  
      console.log("reached match bio data");
      const response = await axios.post(`https://5zngffqh-3000.inc1.devtunnels.ms/auth/biometrics/${formData.get('type')}/match`, formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response in match bio data: ", response);
      
      return response.data;
    } catch (error) {
      console.error("Error in match bio data:", error);
      throw error;
    }
  };