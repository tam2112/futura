export interface CloudinaryUploadResult {
    secure_url: string;
    public_id?: string;
    [key: string]: any; // Allow additional fields for flexibility
}
