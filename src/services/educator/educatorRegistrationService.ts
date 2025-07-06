import { EducatorRegistrationData, EducatorRegistrationResponse, EducatorRegistrationFormData } from "../../types/educator";
import { apiClient } from "../../utils/apiClient";

export class EducatorRegistrationService {
    static async registerEducator(formData: EducatorRegistrationFormData): Promise<EducatorRegistrationResponse> {
        try {
            // Transform form data to API payload format
            const payload: EducatorRegistrationData = {
                user_account: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    login_id: formData.loginId,
                    mobile_no: formData.educatorPhone,
                    email_id: formData.educatorEmail,
                    user_roles: [
                        {
                            role: {
                                role_id: 2 // Educator role ID
                            }
                        }
                    ]
                },
                school: {
                    school_code: formData.schoolCode,
                    school_name: formData.schoolName,
                    school_email: formData.emailAddress,
                    school_mobile_no: formData.phoneNumber,
                    address_line1: formData.addressLine1,
                    address_line2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    pincode: formData.pincode
                }
            };

            const response = await apiClient.post("/auth/register", payload, false);
            return {
                error: response.error,
                message: response.message,
                token: response.token
            };
        } catch (error) {
            console.error("Error registering educator:", error);
            return {
                error: true,
                message: error instanceof Error ? error.message : "Registration failed",
            };
        }
    }
} 